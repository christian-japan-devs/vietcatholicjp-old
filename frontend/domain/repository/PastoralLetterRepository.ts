import { PastoralLetter } from '../models/PastoralLetter'
import { ApolloClient, gql } from '@apollo/client'
import { Locale } from '../models/Locale'
import { inject, singleton } from 'tsyringe'
import { AppProfile } from '../config/AppProfile'

export interface PastoralLetterRepository {
  latestEntry (locale: Locale): Promise<PastoralLetter | null>
}

/**********************************************************************************************************************/

@singleton()
export class ApolloPastoralLetterRepository implements PastoralLetterRepository {
  private readonly apolloClient: ApolloClient<any>
  private readonly appProfile: AppProfile

  constructor (apolloClient: ApolloClient<any>, @inject('AppProfile') appProfile: AppProfile) {
    this.apolloClient = apolloClient
    this.appProfile = appProfile
  }

  async latestEntry (locale: Locale): Promise<PastoralLetter | null> {
    const entryItems = (await this.apolloClient.query({
      query: gql`
        query fetchLatestEntry($preview: Boolean, $locale: String) {
          pastoralLetterCollection(limit: 1, order: date_DESC, preview: $preview, locale: $locale) {
            items {
              sys {
                id
              },
              date,
              subject,
              author,
              content
            }
          }
        }
      `,
      variables: {
        "preview": !this.appProfile.isProduction(),
        "locale": locale
      }
    })).data.pastoralLetterCollection.items

    if (entryItems.length == 0) {
      return null
    }

    const latestItem = entryItems[0]
    return {
      id: latestItem.sys.id,
      date: new Date(latestItem.date),
      author: latestItem.author,
      content: latestItem.content,
      subject: latestItem.subject,
    } as PastoralLetter
  }
}
