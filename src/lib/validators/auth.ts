import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const accountSchema = z
  .object({
    role: z.enum(["STUDENT", "INSTRUCTOR"]),
    name: z.string().trim().min(2, "Please enter your full name"),
    email: z.string().email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .refine((value) => value === "" || /^(\+?88)?01[3-9]\d{8}$/.test(value), {
        message: "Enter a valid mobile number, e.g. 01712345678",
      })
      .optional(),
    password: z.string().min(6, "Use at least 6 characters"),
    confirmPassword: z.string().min(1, "Type your password again"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "The two passwords don't match",
  });
export type AccountValues = z.infer<typeof accountSchema>;

export const studentDetailsSchema = z.object({
  studentId: z.string().trim().min(3, "Enter your student ID"),
  departmentId: z.string().min(1, "Choose your department"),
  programId: z.string().min(1, "Choose your programme"),
  enrollYear: z.string().min(1, "Choose your intake year"),
});
export type StudentDetailsValues = z.infer<typeof studentDetailsSchema>;

export const facultyDetailsSchema = z.object({
  employeeId: z.string().trim().min(3, "Enter your employee ID"),
  departmentId: z.string().min(1, "Choose your department"),
  designation: z.string().trim().optional(),
});
export type FacultyDetailsValues = z.infer<typeof facultyDetailsSchema>;
