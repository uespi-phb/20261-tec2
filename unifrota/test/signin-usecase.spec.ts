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
  let input: SignInInput
  let userAuth: UserAuthData
  let loadUserByEmail: MockProxy<LoadUserByEmail>
  let passwordComparer: MockProxy<PasswordComparer>
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
    loadUserByEmail = mock<LoadUserByEmail>()
    loadUserByEmail.load.mockResolvedValue(userAuth)
    passwordComparer = mock<PasswordComparer>()
    passwordComparer.compare.mockResolvedValue(true)
    signInUseCase = new SignInUseCase(loadUserByEmail, passwordComparer)
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
    // Act
    await signInUseCase.execute(input)
    // Assert
    expect(passwordComparer.compare).not.toHaveBeenCalled()
  })
})
