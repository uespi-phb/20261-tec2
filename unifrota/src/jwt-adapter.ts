import jwt from 'jsonwebtoken'

import type { AccessTokenGenerator } from '#src/access-token-generator'
import type { AccessTokenValidator } from '#src/access-token-validator'

export class JwtAdapter<P extends object> implements AccessTokenGenerator<P>, AccessTokenValidator<P> {
  constructor(private readonly secret: string) {}

  async validate(token: string): Promise<P | null> {
    const payload = jwt.verify(token, this.secret) as P & jwt.JwtPayload
    delete payload.iat
    return payload
  }

  async generate(payload: P): Promise<string> {
    return jwt.sign(payload, this.secret)
  }
}
