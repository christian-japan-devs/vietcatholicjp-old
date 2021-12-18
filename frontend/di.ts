import 'reflect-metadata'
import { container } from 'tsyringe'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'
import { setContext } from '@apollo/client/link/context'
import { ContentfulGraphqlArticleRepository } from './domain/repository/ArticleRepository'
import { ContentfulGraphqlDailyReadingRepository } from './domain/repository/DailyReadingRepository'
import { SimplePropertiesImpl } from './domain/config/Properties'
import { EnvVarProfile } from './domain/config/AppProfile'
import { ContentfulGraphqlArticleGroupRepository } from './domain/repository/ArticleGroupRepository'

const properties = container.resolve(SimplePropertiesImpl)
const authLink = setContext((_, {headers}) => {
  const token = properties.cmsApiKey()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${ token }` : "",
    }
  }
});

export const initInjector = () => {
  container.register<ApolloClient<any>>(ApolloClient, {
    useValue: new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink.concat(new HttpLink({uri: properties.cmsEndpoint, fetch}))
    })
  })

  container.register('AppProfile', {useClass: EnvVarProfile})
  container.register('ArticleRepository', {useClass: ContentfulGraphqlArticleRepository})
  container.register('DailyReadingRepository', {useClass: ContentfulGraphqlDailyReadingRepository})
  container.register('ArticleGroupRepository', {useClass: ContentfulGraphqlArticleGroupRepository})
}
