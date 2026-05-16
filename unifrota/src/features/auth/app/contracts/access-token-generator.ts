export interface AccessTokenGenerator<P> {
  generate: (payload: P) => Promise<string>
}
