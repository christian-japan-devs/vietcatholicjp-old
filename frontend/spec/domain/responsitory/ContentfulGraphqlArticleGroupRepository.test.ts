import { container } from 'tsyringe'
import { Locale } from '../../../domain/models/Locale'
import { ArticleGroupRepository } from '../../../domain/repository/ArticleGroupRepository'

describe('ApolloDailyGospelRepository', () => {
  let underTest: ArticleGroupRepository

  beforeEach(() => {
    underTest = container.resolve('ArticleGroupRepository')
  })

  describe('expand', () => {
    it('should populate the instance correctly', async () => {
      const node = await underTest.expand('4WNyEdR6jVnsYaay5OiQKL', Locale.VIETNAMESE)
      const expectedNode = {
        id: '4WNyEdR6jVnsYaay5OiQKL',
        title: 'Test: Giáo Lý',
        articleId: '35Pmx3R4I6YTvJqhFHnxyI',
        children: [
          {
            id: '7lCABHcl1RgXLReKp4j29U',
            title: 'Test: Tân Tòng',
            articleId: null,
            children: []
          },
          {
            id: '2873Lqcji3gxQBgxRrIqV0',
            title: 'Test: Hôn Nhân',
            articleId: null,
            children: []
          }
        ]
      }

      expect(node).toEqual(expectedNode)
    })

    it('should behave well in case of empty article and empty children', async () => {
      const node = await underTest.expand('2zM7fRSk8KfH8PZtuuaf5k', Locale.VIETNAMESE)
      const expectedNode = {
        id: '2zM7fRSk8KfH8PZtuuaf5k',
        title: 'Test: Bài 1',
        articleId: null,
        children: []
      }

      expect(node).toEqual(expectedNode)
    })
  })
})
