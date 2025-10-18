import api from "../axios";

export interface RegisterPayload { 
  email: string; 
  password: string; 
}

export async function loginUser(data: RegisterPayload) {
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
