import { ReadingArticle } from './ReadingArticle'

export interface DailyReading {
  id: string,
  date: Date,
  lectionaryYear: string,
  title: string,
  brief: string,
  firstReading: ReadingArticle,
  responsorialPsalm: ReadingArticle,
  secondReading: ReadingArticle,
  alleluia: ReadingArticle,
  gospel: ReadingArticle,
  reflectionHtml: string,
}