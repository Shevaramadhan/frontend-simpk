export type Role = 'MARKETING' | 'OPERASIONAL' | 'TIM' | 'KLIEN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
