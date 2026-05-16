import jwt from 'jsonwebtoken'

import { JwtAdapter } from '#src/jwt-adapter'

describe('JwtAdapter', () => {
  let payload: object
  let secret: string
  let token: string
  let sut: JwtAdapter<typeof payload>

  beforeAll(() => {
    payload = { id: 12345, email: 'john.doe@email.com' }
    secret = 'any_secret'
    token = jwt.sign(payload, secret)
    sut = new JwtAdapter<typeof payload>(secret)
  })

  beforeEach(() => {
    vi.spyOn(jwt, 'sign')
  })

  describe('generate', () => {
    test('Should return signed access token when a valid payload is provided', async () => {
      const token = await sut.generate(payload)

      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    test('Should generate token using JWT sign with correct payload and secret', async () => {
      await sut.generate(payload)
      expect(jwt.sign).toHaveBeenCalledWith(payload, secret)
    })

    test('Should return access token that can be validated with the same inject secret', async () => {
      const token = await sut.generate(payload)
      const result = await sut.validate(token)

      expect(result).toMatchObject(payload)
    })
  })

  describe('validate', () => {
    test('Should return correct payload when token is valid', async () => {
      const validatedPayload = await sut.validate(token)

      expect(validatedPayload).toStrictEqual(payload)
    })
  })
})
