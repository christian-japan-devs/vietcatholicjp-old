import React from 'react'
import { LatestPastoralLetterCard } from '../../components/LatestPastoralLetterCard'
import { container } from 'tsyringe'
import { Locale } from '../../domain/models/Locale'

export default class Construction extends React.Component<any, any> {
  render () {
    return <LatestPastoralLetterCard
      repository={ container.resolve('PastoralLetterRepository') }
      locale={ Locale.VIETNAMESE }
    />
  }
}
