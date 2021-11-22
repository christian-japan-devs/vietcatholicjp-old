import {
    ApolloPastoralLetterRepository,
    PastoralLetterRepository
} from '../../../domain/repository/PastoralLetterRepository'
import { container } from 'tsyringe'
import { Locale } from '../../../domain/models/Locale'

describe('ApolloPastoralLetterRepository', () => {
let underTest: PastoralLetterRepository

beforeEach(() => {
    underTest = container.resolve('PastoralLetterRepository')
})

describe('latestEntry', () => {
    it('should return the latest entry correctly', async () => {
    const latestEntry = await underTest.latestEntry(Locale.VIETNAMESE)
    expect(latestEntry?.id).toEqual('4IK66nG5xN7ahyh2OEPGVY')
    })
})
})