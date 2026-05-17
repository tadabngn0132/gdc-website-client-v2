import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
  token: string;
}

class AuthService {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      payload,
    );
    return response.data;
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      payload,
    );
    return response.data;
  }
}

export default new AuthService();
