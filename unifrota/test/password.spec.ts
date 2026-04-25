import { InvalidPasswordError } from '#src/invalid-password-error'
import { Password } from '#src/password'

describe('Password', () => {
  test('Should create a valid Password object storing original password', () => {
    const validPassword = 'AbCDe123'

    const password = new Password(validPassword)

    expect(password.value).toBe(validPassword)
  })

  test.each([
    'Ab1',
    'password_without_upper_letter',
    'PASSWORD_WITHOUT_LOWER_LETTER',
    'Password_Without_Digit',
    '1234567890',
    undefined,
    null,
  ])('Should throw InvalidPasswordError when password is invalid: "%s"', (password: unknown) => {
    expect(() => new Password(password as string)).toThrow(InvalidPasswordError)
  })

  test('Should compare thow password objects', () => {
    const password1 = new Password('V4l1dP4ssw0rd')
    const password2 = new Password('V4l1dP4ssw0rd')
    const password3 = new Password('V4l1dP4ssw0rd&&')

    expect(password1.isEqual(password2)).toBe(true)
    expect(password1.isEqual(password3)).toBe(false)
  })

  test('Should check if a string is a valid password', () => {
    const validPassword = 'V4l1dP4ssw0rd'

    expect(Password.isValid(validPassword)).toBe(true)
  })
})
