import { ApolloArticleRepository, ArticleRepository } from '../../../domain/repository/ArticleRepository'
import { container } from 'tsyringe'
import { Locale } from '../../../domain/models/Locale'

describe('ApolloArticleRepository', () => {
  let underTest: ArticleRepository

  beforeEach(() => {
    underTest = container.resolve('ArticleRepository')
  })

  describe('latestEntries', () => {
    it('should return the latest entries correctly', async () => {
      const articles = await underTest.latestEntries(10, Locale.VIETNAMESE)
      const expected = [
        {
          id: '71q349dybS5v2Y9ANIREb6',
          title: 'NGỢI KHEN THIÊN CHÚA VÌ THÁNH CẢ GIUSE (Latest)',
          thumbnailUrl: 'https://images.ctfassets.net/cc0hz5irnide/9t4jDQQwt1his5LRMkDQV/0dcc58542989e4e2b861b403f607b75f/000107506.jpg',
          author: 'Khoi Hoang',
          date: new Date('2021-11-15T00:00:00.000Z'),
          brief: 'Hoang Khoi Hoang Khoi',
          content: ''
        },
        {
          id: '35Pmx3R4I6YTvJqhFHnxyI',
          title: 'NGỢI KHEN THIÊN CHÚA VÌ THÁNH CẢ GIUSE',
          thumbnailUrl: 'https://images.ctfassets.net/cc0hz5irnide/9t4jDQQwt1his5LRMkDQV/0dcc58542989e4e2b861b403f607b75f/000107506.jpg',
          author: 'Khoi Hoang',
          date: new Date('2021-11-14T00:00:00.000Z'),
          brief: 'Hoang Khoi Hoang Khoi',
          content: ''
        }
      ]

      expect(articles).toEqual(expected)
    })
  })

  describe('entry', () => {
    it('should return the correct entry if it is found', async () => {
      const actualArticle = await underTest.entry('71q349dybS5v2Y9ANIREb6', Locale.VIETNAMESE)
      const expectedArticle = {
        id: '71q349dybS5v2Y9ANIREb6',
        title: 'NGỢI KHEN THIÊN CHÚA VÌ THÁNH CẢ GIUSE (Latest)',
        thumbnailUrl: 'https://images.ctfassets.net/cc0hz5irnide/9t4jDQQwt1his5LRMkDQV/0dcc58542989e4e2b861b403f607b75f/000107506.jpg',
        author: 'Khoi Hoang',
        date: new Date('2021-11-15T00:00:00.000Z'),
        brief: 'Hoang Khoi Hoang Khoi',
        content: '<p>Hoang Khoi Dep Trai</p><img src="https://images.ctfassets.net/cc0hz5irnide/9t4jDQQwt1his5LRMkDQV/0dcc58542989e4e2b861b403f607b75f/000107506.jpg" alt=""/><p></p>'
      }

      expect(actualArticle).toEqual(expectedArticle)
    })

    it('should return null if entry is not found', async () => {
      const actualArticle = await underTest.entry('memes', Locale.VIETNAMESE)
      expect(actualArticle).toBeNull()
    })
  })
})