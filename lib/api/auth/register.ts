import api from "../axios";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  street: string;
  state: string;
  city: string;
}

export async function registerUser(data: RegisterPayload) {
  try {
    const res = await api.post(`/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}
