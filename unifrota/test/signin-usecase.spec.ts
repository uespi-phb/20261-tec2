import { describe, test, expect, beforeAll } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

import type { AccessToken } from '#src/access-token'
import type { AccessTokenGenerator } from '#src/access-token-generator'
import { InvalidCredentialsError } from '#src/invalid-credentials-error'
import { InvalidEmailError } from '#src/invalid-email-error'
import type { LoadUserByEmail, UserAuthData } from '#src/load-user-by-email'
import type { PasswordComparer } from '#src/password-comparer'
import { SignInUseCase } from '#src/signin-usecase'
import type { SignInInput, AccessTokenPayload } from '#src/signin-usecase'

describe('SignInUseCase', () => {
  let input: SignInInput
  let userAuth: UserAuthData
  let accessToken: AccessToken
  let payload: AccessTokenPayload
  let loadUserByEmail: MockProxy<LoadUserByEmail>
  let passwordComparer: MockProxy<PasswordComparer>
  let accessTokenGenerator: MockProxy<AccessTokenGenerator<AccessTokenPayload>>
  let sut: SignInUseCase

  beforeAll(() => {
    input = {
      email: 'john.doe@email.com',
      password: 'Any_Pl41n_P4ssw0rd',
    }
    userAuth = {
      userId: 'any_user_id',
      userName: 'John Doe',
      passwordHash: 'any_hashed_password',
    }
    accessToken = {
      accessToken: 'any_access_token',
    }
    payload = {
      userId: userAuth.userId,
      userEmail: input.email,
    }
    loadUserByEmail = mock<LoadUserByEmail>()
    loadUserByEmail.load.mockResolvedValue(userAuth)
    passwordComparer = mock<PasswordComparer>()
    passwordComparer.compare.mockResolvedValue(true)
    accessTokenGenerator = mock<AccessTokenGenerator<AccessTokenPayload>>()
    accessTokenGenerator.generate.mockResolvedValue(accessToken.accessToken)
    sut = new SignInUseCase(loadUserByEmail, passwordComparer, accessTokenGenerator)
  })

  test('Should call LoadUserByEmail with provided email', async () => {
    // Act
    await sut.execute(input)
    // Assert
    expect(loadUserByEmail.load).toHaveBeenCalledWith(input.email)
  })

  test('Should call PasswordComparer with loaded user hashed password', async () => {
    // Act
    await sut.execute(input)
    // Assert
    expect(passwordComparer.compare).toHaveBeenCalledWith(input.password, userAuth.passwordHash)
  })

  test('Should throw InvalidCredentialsError if user is not found by email', async () => {
    // Arrange
    loadUserByEmail.load.mockResolvedValueOnce(null)
    // Act / Assert
    await expect(() => sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
  })

  test('Should throw InvalidCredentialsError if user password is invalid', async () => {
    // Arrange
    passwordComparer.compare.mockResolvedValueOnce(false)
    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
  })

  test('Should not call PasswordComparer if user is not found by email', async () => {
    // Arrange
    loadUserByEmail.load.mockResolvedValueOnce(null)

    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
    expect(passwordComparer.compare).not.toHaveBeenCalled()
  })

  test('Should call AccessTokenGenerator with correct payload', async () => {
    // Act
    await sut.execute(input)

    // Assert
    expect(accessTokenGenerator.generate).toHaveBeenCalledWith(payload)
  })

  test('Should return AccessToken if user credentials are valid', async () => {
    // Act
    const token = await sut.execute(input)
    // Assert
    expect(token).toStrictEqual(accessToken)
  })

  test('Should propagate error from LoadUserByEmail', async () => {
    // Arrange
    const error = new Error('any_load_user_by_email_error')
    loadUserByEmail.load.mockImplementationOnce(() => {
      throw error
    })
    // Act / Assert
    await expect(() => sut.execute(input)).rejects.toThrow(error.message)
  })

  test('Should propagate errors from PasswordComparer', async () => {
    // Arrange
    const error = new Error('any_password_comparer_error')
    passwordComparer.compare.mockImplementationOnce(() => {
      throw error
    })
    // Act / Assert
    await expect(() => sut.execute(input)).rejects.toThrow(error.message)
  })

  test('Should propagate errors from AccessTokenGenerator', async () => {
    // Arrange
    const error = new Error('any_access_token_generator_error')
    accessTokenGenerator.generate.mockImplementationOnce(() => {
      throw error
    })
    // Act / Assert
    await expect(() => sut.execute(input)).rejects.toThrow(error.message)
  })

  test('Should not call GenerateAccessToken if user credentials are invalid', async () => {
    // Arrange
    passwordComparer.compare.mockResolvedValueOnce(false)
    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
    expect(accessTokenGenerator.generate).not.toHaveBeenCalled()
  })

  test('Should not authenticate if email is invalid', async () => {
    // Arrange
    const input = {
      email: 'invalid_email',
      password: 'any_valid_plain_password',
    }
    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow(InvalidEmailError)
  })

  test('Should not authenticate if password is invalid', async () => {
    // Arrange
    const input = {
      email: 'john.doe@email.com',
      password: 'any_invalid_plain_password',
    }
    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow()
  })
})
