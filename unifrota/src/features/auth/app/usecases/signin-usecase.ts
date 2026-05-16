import type { AccessTokenGenerator } from '#src/features/auth/app/contracts/access-token-generator'
import type { LoadUserByEmail } from '#src/features/auth/app/contracts/load-user-by-email'
import type { PasswordComparer } from '#src/features/auth/app/contracts/password-comparer'
import type { AccessToken } from '#src/features/auth/app/dtos/access-token'
import { InvalidCredentialsError } from '#src/features/auth/app/errors/invalid-credentials-error'
import { Email } from '#src/features/auth/domain/value-objects/email'
import { Password } from '#src/features/auth/domain/value-objects/password'
import type { UseCase } from '#src/shared/contracts/usecase'

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
