export interface JwtPayload {
  sub: string; // user ID
  iat?: number;
  exp?: number;
}
