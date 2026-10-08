"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api";
import {
  createInstructorProfile,
  createStudentProfile,
  loginRequest,
  registerRequest,
} from "@/lib/auth-api";
import { fetchDepartments, fetchPrograms } from "@/lib/catalog-api";
import { ROLE_HOME } from "@/lib/constants";
import {
  accountSchema,
  facultyDetailsSchema,
  studentDetailsSchema,
  type AccountValues,
  type FacultyDetailsValues,
  type StudentDetailsValues,
} from "@/lib/validators/auth";
import { useAuthStore } from "@/store/auth-store";

// A fixed list keeps the intake dropdown stable between server and browser
const INTAKE_YEARS = ["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020"].map((year) => ({
  value: year,
  label: year,
}));

type JoiningRole = AccountValues["role"];

type Details =
  | { role: "STUDENT"; values: StudentDetailsValues }
  | { role: "INSTRUCTOR"; values: FacultyDetailsValues };

export function RegisterWizard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const startSession = useAuthStore((state) => state.startSession);

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<JoiningRole>("STUDENT");
  const creatingAccount = useRef(false);

  // Someone who is already signed in has no reason to be on this page,
  // unless they are in the middle of finishing sign-up right now
  useEffect(() => {
    if (hydrated && user && !creatingAccount.current) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [hydrated, user, router]);

  const createAccount = useMutation({
    mutationFn: async (values: AccountValues) => {
      creatingAccount.current = true;
      try {
        await registerRequest({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          phone: values.phone || undefined,
        });
        // Department and programme lists need a token, so sign in right away
        const session = await loginRequest(values.email, values.password);
        startSession(session);
        return values.role;
      } catch (error) {
        creatingAccount.current = false;
        throw error;
      }
    },
    onSuccess: (selectedRole) => {
      setRole(selectedRole);
      setStep(2);
      toast.success("Account created. One last step.");
    },
    onError: (error) => toast.error(getErrorMessage(error, "We couldn't create your account.")),
  });

  const saveDetails = useMutation({
    mutationFn: async (details: Details) => {
      if (details.role === "STUDENT") {
        await createStudentProfile({
          studentId: details.values.studentId,
          departmentId: details.values.departmentId,
          programId: details.values.programId,
          enrollYear: Number(details.values.enrollYear),
        });
      } else {
        await createInstructorProfile({
          employeeId: details.values.employeeId,
          departmentId: details.values.departmentId,
          designation: details.values.designation || undefined,
        });
      }
    },
    onSuccess: () => {
      toast.success("You're all set.");
      router.replace(ROLE_HOME[role]);
    },
    onError: (error) => toast.error(getErrorMessage(error, "We couldn't save your details.")),
  });

  function skipDetails() {
    toast.info("You can add your academic details later from your profile.");
    router.replace(ROLE_HOME[role]);
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-gold">Step {step} of 2</p>
        <h1 className="text-3xl font-semibold text-primary">
          {step === 1 ? "Create your account" : "Your academic details"}
        </h1>
        <p className="text-muted-foreground">
          {step === 1
            ? "Tell us who you are and how you will sign in."
            : "We use these to place you in the right department."}
        </p>
      </header>

      {step === 1 && (
        <AccountStep submitting={createAccount.isPending} onSubmit={(values) => createAccount.mutate(values)} />
      )}

      {step === 2 && role === "STUDENT" && (
        <StudentStep
          submitting={saveDetails.isPending}
          onSkip={skipDetails}
          onSubmit={(values) => saveDetails.mutate({ role: "STUDENT", values })}
        />
      )}

      {step === 2 && role === "INSTRUCTOR" && (
        <FacultyStep
          submitting={saveDetails.isPending}
          onSkip={skipDetails}
          onSubmit={(values) => saveDetails.mutate({ role: "INSTRUCTOR", values })}
        />
      )}

      {step === 1 && (
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}

function AccountStep({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: (values: AccountValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      role: "STUDENT",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const role = watch("role");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">I am joining as</legend>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "STUDENT", label: "A student" },
              { value: "INSTRUCTOR", label: "Faculty" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={role === option.value}
              onClick={() => setValue("role", option.value)}
              className={`rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                role === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card hover:bg-secondary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" {...register("name")} />
      </FormField>

      <FormField label="Email" htmlFor="reg-email" error={errors.email?.message}>
        <Input id="reg-email" type="email" autoComplete="email" {...register("email")} />
      </FormField>

      <FormField label="Mobile number (optional)" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" type="tel" autoComplete="tel" placeholder="01712345678" {...register("phone")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Password" htmlFor="reg-password" error={errors.password?.message}>
          <Input id="reg-password" type="password" autoComplete="new-password" {...register("password")} />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirm" error={errors.confirmPassword?.message}>
          <Input id="confirm" type="password" autoComplete="new-password" {...register("confirmPassword")} />
        </FormField>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Create account and continue
      </Button>
    </form>
  );
}

function StudentStep({
  submitting,
  onSkip,
  onSubmit,
}: {
  submitting: boolean;
  onSkip: () => void;
  onSubmit: (values: StudentDetailsValues) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StudentDetailsValues>({
    resolver: zodResolver(studentDetailsSchema),
    defaultValues: { studentId: "", departmentId: "", programId: "", enrollYear: "" },
  });

  const departmentId = watch("departmentId");

  const departments = useQuery({ queryKey: ["departments"], queryFn: fetchDepartments });
  const programs = useQuery({
    queryKey: ["programs", departmentId],
    queryFn: () => fetchPrograms(departmentId),
    enabled: Boolean(departmentId),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField label="Student ID" htmlFor="studentId" error={errors.studentId?.message}>
        <Input id="studentId" {...register("studentId")} />
      </FormField>

      <FormField label="Department" htmlFor="departmentId" error={errors.departmentId?.message}>
        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <SelectField
              id="departmentId"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setValue("programId", "");
              }}
              placeholder={departments.isLoading ? "Loading departments..." : "Choose your department"}
              options={(departments.data ?? []).map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))}
            />
          )}
        />
      </FormField>

      <FormField label="Programme" htmlFor="programId" error={errors.programId?.message}>
        <Controller
          control={control}
          name="programId"
          render={({ field }) => (
            <SelectField
              id="programId"
              value={field.value}
              onChange={field.onChange}
              disabled={!departmentId}
              placeholder={departmentId ? "Choose your programme" : "Pick a department first"}
              options={(programs.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
            />
          )}
        />
      </FormField>

      <FormField label="Intake year" htmlFor="enrollYear" error={errors.enrollYear?.message}>
        <Controller
          control={control}
          name="enrollYear"
          render={({ field }) => (
            <SelectField
              id="enrollYear"
              value={field.value}
              onChange={field.onChange}
              placeholder="Year you joined"
              options={INTAKE_YEARS}
            />
          )}
        />
      </FormField>

      <StepActions submitting={submitting} onSkip={onSkip} />
    </form>
  );
}

function FacultyStep({
  submitting,
  onSkip,
  onSubmit,
}: {
  submitting: boolean;
  onSkip: () => void;
  onSubmit: (values: FacultyDetailsValues) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FacultyDetailsValues>({
    resolver: zodResolver(facultyDetailsSchema),
    defaultValues: { employeeId: "", departmentId: "", designation: "" },
  });

  const departments = useQuery({ queryKey: ["departments"], queryFn: fetchDepartments });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField label="Employee ID" htmlFor="employeeId" error={errors.employeeId?.message}>
        <Input id="employeeId" {...register("employeeId")} />
      </FormField>

      <FormField label="Department" htmlFor="faculty-department" error={errors.departmentId?.message}>
        <Controller
          control={control}
          name="departmentId"
          render={({ field }) => (
            <SelectField
              id="faculty-department"
              value={field.value}
              onChange={field.onChange}
              placeholder={departments.isLoading ? "Loading departments..." : "Choose your department"}
              options={(departments.data ?? []).map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))}
            />
          )}
        />
      </FormField>

      <FormField label="Designation (optional)" htmlFor="designation" error={errors.designation?.message}>
        <Input id="designation" placeholder="e.g. Assistant Professor" {...register("designation")} />
      </FormField>

      <StepActions submitting={submitting} onSkip={onSkip} />
    </form>
  );
}

function StepActions({ submitting, onSkip }: { submitting: boolean; onSkip: () => void }) {
  return (
    <div className="flex gap-3 pt-2">
      <Button type="button" variant="ghost" onClick={onSkip} disabled={submitting}>
        Skip for now
      </Button>
      <Button type="submit" className="flex-1" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Finish
      </Button>
    </div>
  );
}
