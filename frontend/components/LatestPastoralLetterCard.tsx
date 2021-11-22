import React from 'react'
import { PastoralLetterRepository } from '../domain/repository/PastoralLetterRepository'
import { Card, Typography } from '@mui/material'
import { PastoralLetter } from '../domain/models/PastoralLetter'
import { Locale } from '../domain/models/Locale'

type Prop = {
  repository: PastoralLetterRepository,
  locale: Locale
}

type State = {
  entry: PastoralLetter | null
}

export class LatestPastoralLetterCard extends React.Component<Prop, State> {
  async componentDidMount () {
    this.setState({
      entry: await this.props.repository.latestEntry(this.props.locale)
    })
  }

  render () {
    return <Card>
      <Typography variant={ 'h1' }>${ this.state.entry?.subject }</Typography>
      <Typography variant={'h3'}>${this.state.entry?.date}</Typography>
      <Typography variant={'h3'}>${this.state.entry?.author}</Typography>
      <Typography variant={'body1'}>${this.state.entry?.content}</Typography>
    </Card>
  }
}