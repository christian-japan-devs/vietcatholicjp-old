import { Tag } from './Tag'

export interface Article {
  id: string,
  title: string,
  thumbnailUrl: string,
  date: Date,
  tags: Tag[],
  author: string,
  brief: string,
  content: string,
}
