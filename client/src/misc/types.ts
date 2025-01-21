export type User = {
   id: string;
   name: string;
   email: string;
   password: string;
   role: string;
   active: boolean;
   resetToken?: string | null;
   resetTokenExpiresAt?: Date | null;
   image?: string | null;
}

export type Procedure = {
   id: string;
   price: number;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}