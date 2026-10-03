import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === "string" || typeof decoded.sub !== "string" || typeof decoded.email !== "string") {
    throw new Error("Invalid token");
  }
  return { sub: decoded.sub, email: decoded.email };
}
