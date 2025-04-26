import axios from "axios";
import { addAuthInterceptor } from "./axios";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const AUTH_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts/`;

const api = axios.create({ baseURL: AUTH_API_URL });
addAuthInterceptor(api);

export class AuthenticationError extends Error {
  constructor(
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

interface LoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface RegisterResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface GetUserResponse {
  users: Array<{
    localId: string;
    email: string;
    emailVerified: boolean;
  }>;
}

export const AuthAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    try {
      const { data } = await api.post<LoginResponse>(
        `${AUTH_API_URL}:signInWithPassword?key=${API_KEY}`,
        payload,
      );

      return data;
    } catch (e) {
      throw handleAxiosError(e);
    }
  },

  async register(email: string, password: string): Promise<RegisterResponse> {
    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    try {
      const { data } = await api.post<RegisterResponse>(
        `${AUTH_API_URL}:signUp?key=${API_KEY}`,
        payload,
      );
      return data;
    } catch (e) {
      throw handleAxiosError(e);
    }
  },

  async getUser(idToken: string) {
    try {
      const payload = {
        idToken,
      };
      const response = await api.post<GetUserResponse>(
        `${AUTH_API_URL}:lookup?key=${API_KEY}`,
        payload,
      );

      if (!response.data?.users?.length) {
        throw new Error("No user data found");
      }

      return {
        localId: response.data.users[0].localId,
        email: response.data.users[0].email,
      };
    } catch (error) {
      const handledError = handleAxiosError(error);
      console.error("Failed to fetch user:", handledError.message);
      throw handledError;
    }
  },
};

const handleAxiosError = (e: unknown): Error | AuthenticationError => {
  if (axios.isAxiosError(e) && e.response) {
    return new AuthenticationError(
      `${e.response.status}`,
      e.response.data.error.message,
    );
  } else if (e instanceof Error) {
    return e;
  } else {
    return new Error(String(e));
  }
};
