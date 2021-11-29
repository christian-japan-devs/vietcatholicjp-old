import React from 'react'
import { LatestPastoralLetterCard } from '../../components/LatestPastoralLetterCard'
import { container } from 'tsyringe'
import { Locale } from '../../domain/models/Locale'

// TODO: This page is just for demonstration's sake, it will be deleted soon.
export default class Construction extends React.Component<any, any> {
  render () {
    return <LatestPastoralLetterCard
      repository={ container.resolve('PastoralLetterRepository') }
      locale={ Locale.VIETNAMESE }
    />
  }
}