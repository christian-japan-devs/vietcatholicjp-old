import { Article } from '../models/Article'
import { ApolloClient, gql } from '@apollo/client'
import { Locale } from '../models/Locale'
import { inject, singleton } from 'tsyringe'
import { AppProfile } from '../config/AppProfile'
import { render } from '../util/RichTextHtmlRenderer'

export interface ArticleRepository {
  /**
   * Get the latest entries, only title, thumbnailUrl, date and author and brief are populated.
   */
  latestEntries (count: number, locale: Locale): Promise<Article[]>

  /**
   * Get the full article given the post's ID.
   * @param id
   * @param locale
   */
  entry (id: string, locale: Locale): Promise<Article | null>
}

@singleton()
export class ApolloArticleRepository implements ArticleRepository {
  private static readonly FRAGMENT_BRIEF_ARTICLE = gql`
    fragment articleBriefArticle on Article {
     sys {
        id
      },
      thumbnail {
        url,
        description
      },
      title,
      date,
      author,
      brief,
    }
  `

  private readonly apolloClient: ApolloClient<any>
  private readonly appProfile: AppProfile

  constructor (
    apolloClient: ApolloClient<any>,
    @inject('AppProfile') appProfile: AppProfile
  ) {
    this.apolloClient = apolloClient
    this.appProfile = appProfile
  }

  async entry (id: string, locale: Locale): Promise<Article | null> {
    const article = (await this.apolloClient.query({
      query: gql`
        ${ApolloArticleRepository.FRAGMENT_BRIEF_ARTICLE}
        query article($id: String!, $preview: Boolean, $locale: String) {
          article(id: $id, preview: $preview, locale: $locale) {
           ...articleBriefArticle,
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
          }
        }
      `,
      variables: {
        id: id,
        preview: !this.appProfile.isProduction(),
        locale: locale
      }
    })).data.article

    return article === null ? null : ApolloArticleRepository.makeArticle(article)
  }

  async latestEntries (count: number, locale: Locale): Promise<Article[]> {
    const entryItems = (await this.apolloClient.query({
      query: gql`
        ${ ApolloArticleRepository.FRAGMENT_BRIEF_ARTICLE }
        query latestArticles($limit: Int, $preview: Boolean, $locale: String) {
          articleCollection(limit: $limit, preview: $preview, locale: $locale, order: date_DESC) {
            items {
              ...articleBriefArticle
            }
          }
        }
      `,
      variables: {
        "limit": count,
        "preview": !this.appProfile.isProduction(),
        "locale": locale,
      }
    })).data.articleCollection.items

    return entryItems.map(ApolloArticleRepository.makeArticle)
  }

  /********************************************************************************************************************/

  private static makeArticle (articleItem: any) {
    return {
      id: articleItem.sys.id,
      title: articleItem.title,
      thumbnailUrl: articleItem.thumbnail.url,
      author: articleItem.author,
      date: new Date(articleItem.date),
      brief: articleItem.brief,
      content: articleItem.content ? render(articleItem.content) : ''
    } as Article
  }
}
