export interface AccessTokenValidator<P> {
  validate(token: string): Promise<P | null>
}
