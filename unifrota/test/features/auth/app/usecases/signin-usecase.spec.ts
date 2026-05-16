import { describe, test, expect, beforeAll } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

import type { AccessTokenGenerator } from '#src/features/auth/app/contracts/access-token-generator'
import type { LoadUserByEmail, UserAuthData } from '#src/features/auth/app/contracts/load-user-by-email'
import type { PasswordComparer } from '#src/features/auth/app/contracts/password-comparer'
import type { AccessToken } from '#src/features/auth/app/dtos/access-token'
import { InvalidCredentialsError } from '#src/features/auth/app/errors/invalid-credentials-error'
import type { SignInInput, AccessTokenPayload } from '#src/features/auth/app/usecases/signin-usecase'
import { SignInUseCase } from '#src/features/auth/app/usecases/signin-usecase'
import { InvalidEmailError } from '#src/features/auth/domain/errors/invalid-email-error'
import { ApplicationError } from '#src/shared/errors/application-error'
import { DomainError } from '#src/shared/errors/domain-error'

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
    loadUserByEmail.load.mockResolvedValueOnce(null)
    // Act / Assert
    await expect(() => sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
    await expect(() => sut.execute(input)).rejects.toThrow(ApplicationError)
  })

  test('Should throw InvalidCredentialsError if user password is invalid', async () => {
    // Arrange
    passwordComparer.compare.mockResolvedValueOnce(false)
    passwordComparer.compare.mockResolvedValueOnce(false)
    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
    await expect(sut.execute(input)).rejects.toThrow(ApplicationError)
  })

  test('Should not call PasswordComparer if user is not found by email', async () => {
    // Arrange
    loadUserByEmail.load.mockResolvedValueOnce(null)
    loadUserByEmail.load.mockResolvedValueOnce(null)

    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
    await expect(sut.execute(input)).rejects.toThrow(ApplicationError)
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
    passwordComparer.compare.mockResolvedValueOnce(false)
    // Act / Assert
    await expect(sut.execute(input)).rejects.toThrow(InvalidCredentialsError)
    await expect(sut.execute(input)).rejects.toThrow(ApplicationError)
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
    await expect(sut.execute(input)).rejects.toThrow(DomainError)
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
