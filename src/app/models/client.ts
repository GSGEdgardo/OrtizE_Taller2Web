export interface Client {
    id: number;
    rut: string;
    name: string;
    birthday: Date;
    email: string;
    isActive: boolean;
    gender: Gender;
  }
  
  export interface Gender {
    id: number;
    type: string;
  }