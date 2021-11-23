import { Article } from '../models/Article'
import { ApolloClient, gql } from '@apollo/client'
import { Locale } from '../models/Locale'
import { inject, singleton } from 'tsyringe'
import { AppProfile } from '../config/AppProfile'

export interface ArticleRepository {
  /**
   * Get the latest entries, only title, thumbnailUrl, date and author and brief are populated.
   */
  latestEntries (count: number, locale: Locale): Promise<Article[]>

  /**
   * Get the full article given the post's ID.
   * @param id
   */
  entry (id: string): Promise<Article | null>
}

@singleton()
export class ApolloArticleRepository implements ArticleRepository {
  private readonly apolloClient: ApolloClient<any>
  private readonly appProfile: AppProfile

  constructor (
    apolloClient: ApolloClient<any>,
    @inject('AppProfile') appProfile: AppProfile
  ) {
    this.apolloClient = apolloClient
    this.appProfile = appProfile
  }

  private static makeArticle (articleItem: any) {
    return {
      id: articleItem.sys.id,
      title: articleItem.title,
      thumbnailUrl: articleItem.thumbnail.url,
      author: articleItem.author,
      date: new Date(articleItem.date),
      brief: articleItem.brief,
      content: ''
    } as Article
  }

  entry (id: string): Promise<Article | null> {
    return Promise.resolve(null)
  }

  /********************************************************************************************************************/

  async latestEntries (count: number, locale: Locale): Promise<Article[]> {
    const entryItems = (await this.apolloClient.query({
      query: gql`
        query latestArticles($limit: Int, $preview: Boolean, $locale: String) {
          articleCollection(limit: $limit, preview: $preview, locale: $locale, order: date_DESC) {
            items {
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
              brief
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
}
