import crypto from "crypto";

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;

export function generateNumericOtp(): string {
  const num = crypto.randomInt(100000, 1000000);
  return String(num);
}

export function hashOtp(email: string, otp: string): string {
  const normalized = email.trim().toLowerCase();
  const pepper = process.env.JWT_SECRET || "rentparking-otp-pepper";
  return crypto
    .createHash("sha256")
    .update(`${normalized}:${otp}:${pepper}`)
    .digest("hex");
}

export function verifyOtpHash(email: string, otp: string, storedHash: string): boolean {
  const candidate = hashOtp(email, otp);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(storedHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
