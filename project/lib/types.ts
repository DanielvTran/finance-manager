import { JWTPayload } from "jose";

export interface IUserSettingsForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface TokenPayload extends JWTPayload {
  id: number;
  email: string;
}
