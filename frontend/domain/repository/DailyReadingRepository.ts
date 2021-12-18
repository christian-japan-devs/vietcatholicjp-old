import { DailyReading } from '../models/DailyReading'
import { ApolloClient, gql } from '@apollo/client'
import { Locale } from '../models/Locale'
import { ReadingArticle } from '../models/ReadingArticle'
import { render } from '../util/RichTextHtmlRenderer'
import { inject, singleton } from 'tsyringe'
import { AppProfile } from '../config/AppProfile'

export interface DailyReadingRepository {
  /**
   * @param {string} locale either 'vi' or 'en'.
   * @return null if there is nothing.
   */
  latestEntry (locale: Locale): Promise<DailyReading | null>

  /**
   * Returns the first article by date, null if nothing was found.
   * Note:
   *   - In the CMS, there is no way to enforce that a day only has one article
   *   - This API only returns the first one that matches the specified date.
   * @param date
   * @param locale either 'vi' or 'en'.
   */
  entryByDate (date: Date, locale: Locale): Promise<DailyReading | null>
}

/**********************************************************************************************************************/

@singleton()
export class ApolloDailyReadingRepository implements DailyReadingRepository {
  private static readonly READING_ARTICLE_FRAGMENT = gql`
    fragment readingContent on Reading {
      sys {
        id
      }
      citation,
      content {
        json,
        links {
          assets {
            block {
              sys {
                id
              },
              contentType,
              url
              title,
              description,
            }
          }
        }
      }
      videoUrl,
      audioUrl
    }  
  `
  private static readonly DAILY_READING_FRAGMENT = gql`
    ${ ApolloDailyReadingRepository.READING_ARTICLE_FRAGMENT }
    fragment dailyReadingContent on DailyReading {
      sys {
        id
      }
      date,
      lectionaryYear,
      title,
      brief,
      firstReading {
        ...readingContent
      },
      responsorialPsalm {
        ...readingContent
      }
      secondReading {
        ...readingContent
      }
      alleluia {
        ...readingContent
      }
      gospel {
        ...readingContent
      }
      reflection {
        json,
        links {
          assets {
            block {
              sys {
                id
              },
              contentType,
              url
              title,
              description,
            }
          }
        }
      }
    }
  `
  private readonly apolloClient: ApolloClient<any>
  private readonly appProfile: AppProfile

  constructor (apolloClient: ApolloClient<any>, @inject('AppProfile') appProfile: AppProfile) {
    this.apolloClient = apolloClient
    this.appProfile = appProfile
  }

  /**
   * @param dailyReadingItem
   * @return DailyReading
   * @private
   */
  private static makeDailyReading (dailyReadingItem: any) {
    return {
      id: dailyReadingItem.sys.id,
      date: new Date(dailyReadingItem.date),
      lectionaryYear: dailyReadingItem.lectionaryYear,
      title: dailyReadingItem.title,
      brief: dailyReadingItem.brief,
      firstReading: ApolloDailyReadingRepository.makeReadingArticle(dailyReadingItem.firstReading),
      responsorialPsalm: ApolloDailyReadingRepository.makeReadingArticle(dailyReadingItem.responsorialPsalm),
      secondReading: ApolloDailyReadingRepository.makeReadingArticle(dailyReadingItem.secondReading),
      alleluia: ApolloDailyReadingRepository.makeReadingArticle(dailyReadingItem.alleluia),
      gospel: ApolloDailyReadingRepository.makeReadingArticle(dailyReadingItem.gospel),
      reflectionHtml: render(dailyReadingItem.reflection)
    } as DailyReading
  }

  /**z
   * @param readingArticle
   * @return ReadingArticle
   * @private
   */
  private static makeReadingArticle (readingArticle: any) {
    return {
      id: readingArticle.sys.id,
      citation: readingArticle.citation,
      contentHtml: render(readingArticle.content),
      videoUrl: readingArticle.videoUrl,
      audioUrl: readingArticle.audioUrl,
    } as ReadingArticle
  }

  async latestEntry (locale: Locale): Promise<DailyReading | null> {
    const entries = await this.fetchEntries(0, 1, locale, !this.appProfile.isProduction())
    return entries.length > 0 ? entries[0] : null
  }

  async entryByDate (date: Date, locale: Locale): Promise<DailyReading | null> {
    const entryItems = (await this.apolloClient.query({
      query: gql`
        ${ ApolloDailyReadingRepository.DAILY_READING_FRAGMENT }
        query fetchDailyReading($locale: String, $preview: Boolean, $date: DateTime) {
          dailyReadingCollection(preview: $preview, locale: $locale, limit: 1, where: {date: $date}) {
            items {
              ...dailyReadingContent
            }
          }
        }
      `,
      variables: {
        locale: locale,
        preview: !this.appProfile.isProduction(),
        date: date
      }
    })).data.dailyReadingCollection.items

    return entryItems.length > 0 ? ApolloDailyReadingRepository.makeDailyReading(entryItems[0]) : null
  }

  /**
   * Fetches entries sorted by date in the descending order (later comes first). Possibly re-usable for entries listing.
   * @param offset: for pagination
   * @param limit: how many entries to be returned, max: 1000
   * @param locale: either 'vi' or 'en'
   * @param preview: Whether to fetch the unpublished articles or not (used for development purposes)
   * @private
   */
  private async fetchEntries (offset: number, limit: number, locale: Locale, preview: boolean): Promise<DailyReading[]> {
    const entryItems = (await this.apolloClient.query({
      query: gql`
          ${ ApolloDailyReadingRepository.DAILY_READING_FRAGMENT }
          query fetchLatestDailyReading($locale: String, $preview: Boolean, $offset: Int, $limit: Int) {
            dailyReadingCollection(preview: $preview, locale: $locale, order: date_DESC, limit: $limit, skip: $offset) {
              items {
                ...dailyReadingContent
              }
            }
          }
      `,
      variables: {
        skip: offset,
        limit: limit,
        preview: preview,
        locale: locale,
      }
    })).data.dailyReadingCollection.items  // Contentful's DailyReading type

    return entryItems.map(ApolloDailyReadingRepository.makeDailyReading)
  }
}
