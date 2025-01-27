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