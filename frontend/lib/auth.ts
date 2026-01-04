// frontend/lib/auth.ts
export type UserRole = "admin" | "student";

export const persistAuth = (token: string, role: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getStoredRole = (): string | null => {
  return localStorage.getItem("role");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

