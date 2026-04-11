import { describe, test, expect } from 'vitest'
import { mock } from 'vitest-mock-extended'
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

type SignInInput = {
  email: string
  password: string
}

class SignInUseCase {
  private loadUserByEmail: LoadUserByEmail
  private passwordComparer: PasswordComparer

  constructor(loadUserByEmail: LoadUserByEmail, passwordComparer: PasswordComparer) {
    this.loadUserByEmail = loadUserByEmail
    this.passwordComparer = passwordComparer
  }
  async execute(input: SignInInput): Promise<void> {
    const userAuth = await this.loadUserByEmail.load(input.email)
    if (userAuth === null) {
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
  test('Should call LoadUserByEmail with provided email', async () => {
    // Arrange
    const input = {
      email: 'john.doe@email.com',
      password: 'any_plain_password',
    }
    const userAuth = {
      userId: 'any_user_id',
      userName: 'John Doe',
      passwordHash: 'any_hashed_password',
    }
    const loadUserByEmail = mock<LoadUserByEmail>()
    loadUserByEmail.load.mockResolvedValue(userAuth)
    const passwordComparer = mock<PasswordComparer>()
    const signInUseCase = new SignInUseCase(loadUserByEmail, passwordComparer)
    // Act
    await signInUseCase.execute(input)
    // Assert
    expect(loadUserByEmail.load).toHaveBeenCalledWith(input.email)
  })

  test('Should throw InvalidCredentialsError if user is not found by email', async () => {
    // Arrange
    const input = {
      email: 'john.doe@email.com',
      password: 'any_plain_password',
    }
    const loadUserByEmail = mock<LoadUserByEmail>()
    loadUserByEmail.load.mockResolvedValue(null)
    const passwordComparer = mock<PasswordComparer>()

    const signInUseCase = new SignInUseCase(loadUserByEmail, passwordComparer)

    // Act / Assert
    await expect(signInUseCase.execute(input)).rejects.toThrow(InvalidCredentialsError)
  })

  test('Should not call PasswordComparer if user is not found by email', async () => {
    // Arrange
    const input = {
      email: 'john.doe@email.com',
      password: 'any_plain_password',
    }
    const userAuth = {
      userId: 'any_user_id',
      userName: 'John Doe',
      passwordHash: 'any_hashed_password',
    }
    const loadUserByEmail = mock<LoadUserByEmail>()
    loadUserByEmail.load.mockResolvedValue(userAuth)
    const passwordComparer = mock<PasswordComparer>()
    const signInUseCase = new SignInUseCase(loadUserByEmail, passwordComparer)
    // Act
    await signInUseCase.execute(input)
    // Assert
    expect(passwordComparer.compare).not.toHaveBeenCalled()
  })
})
