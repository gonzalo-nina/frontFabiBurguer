export interface usuario {
  email: string;
  usuario: string;
  clave: string;
  token: string;
  rol?: string; // Añadimos el rol
}

export interface Usuario {
  id?: number;
  usuario: string;
  email: string;
  clave: string;
  activo: boolean;
  rol?:string;
}
  
  export enum UserRoles {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER'
}