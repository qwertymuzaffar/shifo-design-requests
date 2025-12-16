import { Doctor } from '@features/doctor/models/doctor';

export interface UserInterface {
  id: number
  username: string
  email: string
  fullName: string
  role: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  doctor?: Doctor
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'REGISTRAR',
  ACCOUNTANT = 'ACCOUNTANT'
}
