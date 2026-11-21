import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Invalid email").toLowerCase(),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Please enter the 6-digit verification code"),
});

export const onboardingSchema = z.object({
  inviteCode: z.string().trim().min(4, "Society invite code is required").toUpperCase(),
  name: z.string().trim().min(2, "Full name is required").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid 10-digit phone / WhatsApp number"),
  towerName: z.string().trim().min(1, "Tower / Block is required").max(40),
  flatNumber: z.string().trim().min(1, "Flat / House number is required").max(20),
  disclaimerAccepted: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the Security & Liability Disclaimer to continue",
    }),
  }),
});

export const createSocietySchema = z.object({
  name: z.string().trim().min(3, "Society name is required").max(100),
  city: z.string().trim().min(2, "City is required").max(60),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  inviteCode: z
    .string()
    .trim()
    .min(4)
    .max(16)
    .toUpperCase()
    .optional()
    .or(z.literal("")),
  adminEmail: z.string().trim().email("Invalid admin email").toLowerCase().optional().or(z.literal("")),
});

export const createTowerSchema = z.object({
  name: z.string().trim().min(1, "Tower / Block name is required").max(40),
  levels: z
    .string()
    .trim()
    .min(1, "Enter at least one parking level (e.g., B1, B2, Stilt)")
    .max(120),
});

export const parkingSlotSchema = z.object({
  towerId: z.string().optional().nullable(),
  towerName: z.string().trim().min(1, "Tower / Block is required").max(40),
  level: z.string().trim().min(1, "Level / Basement is required").max(30),
  slotNumber: z.string().trim().min(1, "Slot number is required").max(30),
  vehicleType: z.enum(["TWO_WHEELER", "FOUR_WHEELER", "BOTH"]),
  hourlyRate: z.coerce
    .number()
    .int()
    .min(0, "Rate cannot be negative")
    .max(5000, "Rate seems too high"),
  dailyRate: z.coerce
    .number()
    .int()
    .min(0, "Rate cannot be negative")
    .max(20000, "Rate seems too high"),
  upiId: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(250).optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  availableFrom: z.string().optional().nullable(),
  availableUntil: z.string().optional().nullable(),
});

export const createBookingSchema = z.object({
  slotId: z.string().min(1, "Slot is required"),
  vehicleNumber: z
    .string()
    .trim()
    .min(4, "Enter a valid vehicle registration number")
    .max(20)
    .toUpperCase(),
  vehicleType: z.enum(["TWO_WHEELER", "FOUR_WHEELER"]),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
  notes: z.string().trim().max(200).optional().or(z.literal("")),
  disclaimerAccepted: z.literal(true, {
    errorMap: () => ({
      message: "Please acknowledge the security & liability disclaimer before booking",
    }),
  }),
});
