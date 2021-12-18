import { Locale } from '../models/Locale'
import { ArticleGroup } from '../models/ArticleGroup'
import { inject, singleton } from 'tsyringe'
import { ApolloClient, gql } from '@apollo/client'
import { AppProfile } from '../config/AppProfile'

export interface ArticleGroupRepository {
  /**
   * Given an ID, return the corresponding ArticleGroup.
   *
   * Note: for ArticleGroup.children, only children.id and children.title are populate.
   * Use expand() again to populate children's articleId and (nested) children.
   * @param id
   * @param locale
   * @return ArticleGroup, null if not found.
   */
  expand (id: string, locale: Locale): Promise<ArticleGroup | null>
}

@singleton()
export class ContentfulGraphqlArticleGroupRepository implements ArticleGroupRepository {
  private readonly apolloClient: ApolloClient<any>
  private readonly appProfile: AppProfile


  constructor (
    apolloClient: ApolloClient<any>,
    @inject('AppProfile') appProfile: AppProfile
  ) {
    this.apolloClient = apolloClient
    this.appProfile = appProfile
  }

  async expand (id: string, locale: Locale): Promise<ArticleGroup | null> {
    const articleGroup = (await this.apolloClient.query({
      query: gql`
        query expand($preview: Boolean, $locale: String, $id: String!) {
          articleGroup(preview: $preview, locale: $locale, id: $id) {
            sys {
              id
            }
            title,
            nodesCollection {
              items {
                sys {
                  id
                }
                title
              }
            }
            article {
              sys {
                id
              }
            }
          }
        }
        `,
      variables: {
        preview: !this.appProfile.isProduction(),
        locale: locale,
        id: id,
      },
    })).data.articleGroup

    return articleGroup === null ? null : {
      id: articleGroup.sys.id,
      title: articleGroup.title,
      articleId: articleGroup.article === null ? null : articleGroup.article.sys.id,
      children: articleGroup.nodesCollection.items.map((item: any) => ({
        id: item.sys.id,
        title: item.title,
        articleId: null,
        children: [],
      } as ArticleGroup)),
    }
  }
}
