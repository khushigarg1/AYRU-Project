// auth.schema.ts
export interface CreateUserBody {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  gender?: string;
  age?: number;
  role: string;
}

export interface CreateAdminBody {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface LoginUserBody {
  email: string;
  password: string;
}

export interface LoginAdminBody {
  email: string;
  password: string;
}

export interface SendEmailOTPParams {
  email: string;
  phone: string;
  role: string;
}

export interface SendEmailOTPResponse {
  message: string;
}
