export enum Role {
   ADMIN = 'admin',
   USER = 'user',
   MASTER = 'master',
}

export type User = {
   id: string;
   name: string;
   email: string;
   password: string;
   role: Role;
   active: boolean;
   resetToken?: string | null;
   resetTokenExpiresAt?: Date | null;
   image?: string | null;
   token: string | null;
}

export type UserRegistrationData = {
   [K in 'name' | 'password' | 'email' | 'image' | 'role']: User[K];
}

export type UserDataResponse = {
   [K in 'id' | 'name' | 'email' | 'role' | 'active']: User[K];
}

export type LoginResponse = {
   token: string;
   refreshToken: string;
   userData: UserDataResponse;
}

export type UserState = {
   isLoggedIn: boolean;
   userData: null | LoginResponse;
}

export type Master = {
   id: string;
   name: string;
   image: string | null;
   masterProcedures: MasterProcedure[];
}

export type Procedure = {
   id: string;
   duration: number;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}

export type MasterProcedure = {
   id: string;
   masterId: string;
   procedureId: string;
   price: number;
}

export type TimeSlot = {
   id: string;
   masterId: string;
   procedureId: string;
   date: string;
   startTime: string;
   endTime: string;
   isAvailable: boolean;
   createdAt?: Date;
   slotDuration?: number;
}

export type AvailableTimeSlot = {
   [K in 'masterId' | 'procedureId' | 'date']: TimeSlot[K];
}

export enum BookingStatus {
   PENDING = 'pending',
   CONFIRMED = 'confirmed',
   CANCELLED = 'cancelled'
}

export type Booking = {
   id: string;
   userId: string;
   timeSlotId: string;
   createdAt: Date;
   updatedAt: Date;
   status: BookingStatus;
}