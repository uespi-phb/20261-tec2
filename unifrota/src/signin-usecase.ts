import type { AccessToken } from '#src/access-token'
import type { AccessTokenGenerator } from '#src/access-token-generator'
import { Email } from '#src/email'
import { InvalidCredentialsError } from '#src/invalid-credentials-error'
import type { LoadUserByEmail } from '#src/load-user-by-email'
import type { PasswordComparer } from '#src/password-comparer'
import type { UseCase } from '#src/usecase'

import { Password } from './password.js'

export type SignInInput = {
  email: string
  password: string
}

export type SignInOutput = AccessToken

export type AccessTokenPayload = {
  userId: string
  userEmail: string
}

export class SignInUseCase implements UseCase<SignInInput, SignInOutput> {
  constructor(
    private readonly loadUserByEmail: LoadUserByEmail,
    private readonly passwordComparer: PasswordComparer,
    private readonly generateAccessToken: AccessTokenGenerator<AccessTokenPayload>,
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    Email.validate(input.email)
    Password.validate(input.password)

    const userData = await this.loadUserByEmail.load(input.email)
    if (userData === null) {
      throw new InvalidCredentialsError()
    }
    const isCredentialsValid = await this.passwordComparer.compare(input.password, userData.passwordHash)
    if (!isCredentialsValid) {
      throw new InvalidCredentialsError()
    }
    const payload: AccessTokenPayload = {
      userId: userData.userId,
      userEmail: input.email,
    }
    const accessToken = await this.generateAccessToken.generate(payload)
    return {
      accessToken,
    }
  }
}
