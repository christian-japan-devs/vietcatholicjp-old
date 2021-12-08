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
  state: Readonly<State> = {
    entry: {
      date: null,
      id: '',
      author: '',
      content: '',
      subject: '',
    }
  }

  async componentDidMount () {
    this.setState({
      entry: await this.props.repository.latestEntry(this.props.locale)
    })
  }

  render () {
    return (
      <div className="container md:mx-24 mt-8">
          <div className="bg-white h-auto tracking-wide mb-14 shadow-sm border border-black-800 mx-1 rounded-lg relative">
                  <div className="small-banner w-1 h-20 bg-blue-600 absolute rounded-tl-md"></div>
                  <h5 className="text-2xl font-semibold pl-6 pt-6 pr-6 pb-2">
                    { this.state.entry?.subject }
                  </h5>
                  <p className="text-md font-regular p-6 pt-2 text-gray-400">
                  { this.state.entry?.author }
                  </p>
                  <p className="text-md font-regular p-6 pt-2 text-gray-500">
                  { this.state.entry?.content }
                  </p>
          </div>
      </div>
    )
  }
}