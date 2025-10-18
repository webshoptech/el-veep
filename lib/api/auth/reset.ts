import api from "../axios";

export interface RegisterPayload { 
  email: string;  
}

export async function resetPasswordLink(data: RegisterPayload) {
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

export async function verifyOtp(payload: { otp: string }) {
  // Simulate API verification
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function resetPassword(payload: { otp: string; newPassword: string }) {
  // Simulate password reset
  const res = await fetch('/api/auth/set-new-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
