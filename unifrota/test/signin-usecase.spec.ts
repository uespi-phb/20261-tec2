import { describe, test, expect, beforeAll } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'
//
// PRODUCTION CODE
//
type UserAuthData = {
  userId: string
  userName: string
  passwordHash: string
}

interface LoadUserByEmail {
  load: (email: string) => Promise<UserAuthData | null>
}

interface PasswordComparer {
  compare: (plainPassword: string, hashedPassword: string) => Promise<boolean>
}

interface GenerateAccessToken<T> {
  generate: (payload: T) => Promise<T>
}

type SignInInput = {
  email: string
  password: string
}

class SignInUseCase {
  private loadUserByEmail: LoadUserByEmail
  private passwordComparer: PasswordComparer
  private generateAccessToken: GenerateAccessToken<string>

  constructor(
    loadUserByEmail: LoadUserByEmail,
    passwordComparer: PasswordComparer,
    generateAccessToken: GenerateAccessToken<string>,
  ) {
    this.loadUserByEmail = loadUserByEmail
    this.passwordComparer = passwordComparer
    this.generateAccessToken = generateAccessToken
  }
  async execute(input: SignInInput): Promise<void> {
    const userAuth = await this.loadUserByEmail.load(input.email)
    if (userAuth === null) {
      throw new InvalidCredentialsError()
    }
    const isCredentialsValid = await this.passwordComparer.compare(input.password, userAuth.passwordHash)
    if (!isCredentialsValid) {
      throw new InvalidCredentialsError()
    }
  }
}

class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid user credentials') {
    super(message)
  }
}
//
//

describe('SignInUseCase', () => {
  let input: SignInInput
  let userAuth: UserAuthData
  let accessToken: string
  let loadUserByEmail: MockProxy<LoadUserByEmail>
  let passwordComparer: MockProxy<PasswordComparer>
  let generateAccessToken: MockProxy<GenerateAccessToken<string>>
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
    accessToken = 'any_access_token'
    loadUserByEmail = mock<LoadUserByEmail>()
    loadUserByEmail.load.mockResolvedValue(userAuth)
    passwordComparer = mock<PasswordComparer>()
    passwordComparer.compare.mockResolvedValue(true)
    generateAccessToken = mock<GenerateAccessToken<string>>()
    generateAccessToken.generate.mockResolvedValue(accessToken)
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
})
