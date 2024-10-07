export type UsersRes = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  subdomain: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
}[];
