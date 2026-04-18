import { describe, test, expect, beforeAll } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

import type { AccessToken } from '../src/access-token.js'
import type { GenerateAccessToken } from '../src/generate-access-token.js'
import { InvalidCredentialsError } from '../src/invalid-credentials-error.js'
import type { LoadUserByEmail, UserAuthData } from '../src/load-user-by-email.js'
import type { PasswordComparer } from '../src/password-comparer.js'
import { SignInUseCase } from '../src/signin-usecase.js'
import type { SignInInput, AccessTokenPayload } from '../src/signin-usecase.js'

describe('SignInUseCase', () => {
  let input: SignInInput
  let userAuth: UserAuthData
  let accessToken: AccessToken
  let loadUserByEmail: MockProxy<LoadUserByEmail>
  let passwordComparer: MockProxy<PasswordComparer>
  let generateAccessToken: MockProxy<GenerateAccessToken<AccessTokenPayload>>
  let signInUseCase: SignInUseCase

  beforeAll(() => {
    input = {
      email: 'john.doe@email.com',
      password: 'any_plain_password',
    }
    userAuth = {
      userId: 'any_user_id',
      userName: 'John Doe',
      passwordHash: 'any_hashed_password',
    }
    accessToken = {
      accessToken: 'any_access_token',
    }
    loadUserByEmail = mock<LoadUserByEmail>()
    loadUserByEmail.load.mockResolvedValue(userAuth)
    passwordComparer = mock<PasswordComparer>()
    passwordComparer.compare.mockResolvedValue(true)
    generateAccessToken = mock<GenerateAccessToken<AccessTokenPayload>>()
    generateAccessToken.generate.mockResolvedValue(accessToken.accessToken)
    signInUseCase = new SignInUseCase(loadUserByEmail, passwordComparer, generateAccessToken)
  })

  test('Should call LoadUserByEmail with provided email', async () => {
    // Act
    await signInUseCase.execute(input)
    // Assert
    expect(loadUserByEmail.load).toHaveBeenCalledWith(input.email)
  })

  test('Should throw InvalidCredentialsError if user is not found by email', async () => {
    // Arrange
    loadUserByEmail.load.mockResolvedValueOnce(null)
    // Act / Assert
    await expect(signInUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError)
  })

  test('Should not call PasswordComparer if user is not found by email', async () => {
    // Arrange
    loadUserByEmail.load.mockResolvedValueOnce(null)

    // Act / Assert
    await expect(signInUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError)
    expect(passwordComparer.compare).not.toHaveBeenCalled()
  })

  test('Should call PasswordComparer if loaded user hashed password', async () => {
    // Act
    await signInUseCase.execute(input)
    // Assert
    expect(passwordComparer.compare).toHaveBeenCalledWith(input.password, userAuth.passwordHash)
  })

  test('Should throw InvalidCredentialsError if user password is invalid', async () => {
    // Arrange
    passwordComparer.compare.mockResolvedValueOnce(false)
    // Act / Assert
    await expect(signInUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError)
  })

  test('Should not call GenerateAccessToken if user credentials are invalid', async () => {
    // Arrange
    passwordComparer.compare.mockResolvedValueOnce(false)
    // Act / Assert
    await expect(signInUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError)
    expect(generateAccessToken.generate).not.toHaveBeenCalled()
  })

  test('Should return AccessToken if user credentials are valid', async () => {
    // Act
    const token = await signInUseCase.execute(input)
    // Assert
    expect(token).toStrictEqual(accessToken)
  })
})
