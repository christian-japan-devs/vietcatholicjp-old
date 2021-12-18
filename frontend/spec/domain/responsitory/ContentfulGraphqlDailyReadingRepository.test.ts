import { DailyReadingRepository } from '../../../domain/repository/DailyReadingRepository'
import { container } from 'tsyringe'
import { Locale } from '../../../domain/models/Locale'

describe('ApolloDailyGospelRepository', () => {
  let underTest: DailyReadingRepository

  beforeEach(() => {
    underTest = container.resolve('DailyReadingRepository')
  })

  describe('latestEntry', () => {
    it('should returns the most up-to-date entry (based on user-input date)', async () => {
      const latestEntry = await underTest.latestEntry(Locale.VIETNAMESE)
      expect(latestEntry?.id).toEqual('4YCYWyYsoHc77Pkb0cYrnb')
    })
  })

  describe('entryByDate', () => {
    it('should return the entry that matches the date', async () => {
      const date = new Date("2022-05-12T00:00:00.000Z")
      const entry = await underTest.entryByDate(date, Locale.VIETNAMESE)
      expect(entry?.id).toEqual('4YCYWyYsoHc77Pkb0cYrnb')
    })

    it('should return null if there is no matching date', async () => {
      const date = new Date("2023-05-12T00:00:00.000Z")
      const entry = await underTest.entryByDate(date, Locale.VIETNAMESE)
      expect(entry).toBeNull()
    })
  })
})