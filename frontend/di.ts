import 'reflect-metadata'
import { container } from 'tsyringe'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'
import { setContext } from '@apollo/client/link/context'
import { ApolloArticleRepository } from './domain/repository/ArticleRepository'
import { ApolloDailyReadingRepository } from './domain/repository/DailyReadingRepository'
import { SimplePropertiesImpl } from './domain/config/Properties'
import { EnvVarProfile } from './domain/config/AppProfile'

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
  container.register('ArticleRepository', {useClass: ApolloArticleRepository})
  container.register('DailyReadingRepository', {useClass: ApolloDailyReadingRepository})
}
