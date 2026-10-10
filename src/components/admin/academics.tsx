"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Building2, CalendarDays, GraduationCap, Layers } from "lucide-react";
import { z } from "zod";
import { DashHeading } from "@/components/shared/dash-heading";
import { StatusBadge } from "@/components/shared/status-badge";
import { ResourcePanel } from "@/components/admin/resource-panel";
import { useUrlParams } from "@/hooks/use-url-params";
import { getPage } from "@/lib/fetchers";
import { shortDate } from "@/lib/format";

interface Department { id: string; name: string; code: string }
interface Programme { id: string; name: string; degreeLevel: string; totalCredits: number; department?: { name: string } }
interface Course { id: string; code: string; title: string; creditHours: number; department?: { name: string } }
interface Term { id: string; name: string; year: number; startDate: string; endDate: string; isActive: boolean }
interface Section {
  id: string;
  sectionCode: string;
  capacity: number;
  course?: { code: string; title: string };
  semester?: { name: string; year?: number };
  instructor?: { user?: { name: string } };
}
interface UserWithProfile { id: string; name: string; instructor?: { id: string; employeeId: string } | null }

const tabs = [
  { id: "departments", label: "Departments" },
  { id: "programmes", label: "Programmes" },
  { id: "courses", label: "Courses" },
  { id: "terms", label: "Terms" },
  { id: "sections", label: "Sections" },
];

const text = (message: string, min = 2) => z.string().trim().min(min, message);
const picked = (message: string) => z.string().min(1, message);
const wholeNumber = (message: string) => z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, message);

// Dropdown choices loaded from another list, e.g. departments for a new course
function useOptions<T extends { id: string }>(url: string, label: (row: T) => string, params: Record<string, unknown> = {}) {
  const query = useQuery({
    queryKey: ["options", url, params],
    queryFn: () => getPage<T>(url, { limit: 100, ...params }),
  });
  return (query.data?.rows ?? []).map((row) => ({ value: row.id, label: label(row) }));
}

export function Academics() {
  const url = useUrlParams();
  const tab = url.get("tab") || "departments";

  return (
    <>
      <DashHeading title="Academic setup" text="Build the university in order: department, programme, courses, term, then sections." />

      <div role="tablist" className="flex flex-wrap gap-2 border-b pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => url.set({ tab: t.id })}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === t.id ? "bg-primary text-primary-foreground" : "text-primary hover:bg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "departments" && <Departments />}
      {tab === "programmes" && <Programmes />}
      {tab === "courses" && <Courses />}
      {tab === "terms" && <Terms />}
      {tab === "sections" && <Sections />}
    </>
  );
}

function Departments() {
  return (
    <ResourcePanel<Department>
      noun="department"
      endpoint="/departments"
      icon={Building2}
      schema={z.object({ name: text("Enter the department name"), code: text("Enter a short code, e.g. CSE") })}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "Computer Science and Engineering" },
        { name: "code", label: "Code", type: "text", placeholder: "CSE" },
      ]}
      columns={[
        { header: "Name", cell: (d) => <span className="font-medium text-primary">{d.name}</span> },
        { header: "Code", cell: (d) => d.code },
      ]}
      toValues={(d) => ({ name: d.name, code: d.code })}
      toPayload={(v) => ({ name: v.name.trim(), code: v.code.trim().toUpperCase() })}
    />
  );
}

function Programmes() {
  const departments = useOptions<Department>("/departments", (d) => `${d.name} (${d.code})`);
  return (
    <ResourcePanel<Programme>
      noun="programme"
      endpoint="/programs"
      icon={GraduationCap}
      schema={z.object({
        name: text("Enter the programme name"),
        departmentId: picked("Choose a department"),
        degreeLevel: text("Enter the degree level, e.g. Bachelor"),
        totalCredits: wholeNumber("Enter total credits as a whole number"),
      })}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "BSc in Computer Science" },
        { name: "departmentId", label: "Department", type: "select", options: departments, createOnly: true },
        { name: "degreeLevel", label: "Degree level", type: "text", placeholder: "Bachelor" },
        { name: "totalCredits", label: "Total credits", type: "number", placeholder: "144" },
      ]}
      columns={[
        { header: "Programme", cell: (p) => <span className="font-medium text-primary">{p.name}</span> },
        { header: "Department", cell: (p) => p.department?.name ?? "—" },
        { header: "Level", cell: (p) => p.degreeLevel },
        { header: "Credits", cell: (p) => p.totalCredits },
      ]}
      toValues={(p) => ({ name: p.name, degreeLevel: p.degreeLevel, totalCredits: String(p.totalCredits) })}
      toPayload={(v, editing) => ({
        name: v.name.trim(),
        degreeLevel: v.degreeLevel.trim(),
        totalCredits: Number(v.totalCredits),
        ...(!editing && { departmentId: v.departmentId }),
      })}
    />
  );
}

function Courses() {
  const departments = useOptions<Department>("/departments", (d) => `${d.name} (${d.code})`);
  return (
    <ResourcePanel<Course>
      noun="course"
      endpoint="/courses"
      icon={BookOpen}
      schema={z.object({
        code: text("Enter the course code, e.g. CSE101"),
        title: text("Enter the course title"),
        creditHours: wholeNumber("Enter credit hours as a whole number"),
        departmentId: picked("Choose a department"),
      })}
      fields={[
        { name: "code", label: "Course code", type: "text", placeholder: "CSE101", createOnly: true },
        { name: "title", label: "Title", type: "text", placeholder: "Introduction to Programming" },
        { name: "creditHours", label: "Credit hours", type: "number", placeholder: "3" },
        { name: "departmentId", label: "Department", type: "select", options: departments, createOnly: true },
      ]}
      columns={[
        { header: "Code", cell: (c) => <span className="font-medium text-primary">{c.code}</span> },
        { header: "Title", cell: (c) => c.title },
        { header: "Credits", cell: (c) => c.creditHours },
        { header: "Department", cell: (c) => c.department?.name ?? "—" },
      ]}
      toValues={(c) => ({ title: c.title, creditHours: String(c.creditHours) })}
      toPayload={(v, editing) =>
        editing
          ? { title: v.title.trim(), creditHours: Number(v.creditHours) }
          : { code: v.code.trim().toUpperCase(), title: v.title.trim(), creditHours: Number(v.creditHours), departmentId: v.departmentId }
      }
    />
  );
}

const activeOptions = [
  { value: "true", label: "Active (open for enrolment)" },
  { value: "false", label: "Not active" },
];

function Terms() {
  return (
    <ResourcePanel<Term>
      noun="term"
      endpoint="/semesters"
      icon={CalendarDays}
      schema={z.object({
        name: text("Enter the term name, e.g. Spring"),
        year: z.string().refine((v) => Number(v) >= 2000, "Enter a year such as 2026"),
        startDate: picked("Pick a start date"),
        endDate: picked("Pick an end date"),
        isActive: picked("Choose one"),
      })}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "Fall" },
        { name: "year", label: "Year", type: "number", placeholder: "2026", createOnly: true },
        { name: "startDate", label: "Starts", type: "date" },
        { name: "endDate", label: "Ends", type: "date" },
        { name: "isActive", label: "Status", type: "select", options: activeOptions },
      ]}
      columns={[
        { header: "Term", cell: (t) => <span className="font-medium text-primary">{t.name} {t.year}</span> },
        { header: "Starts", cell: (t) => shortDate(t.startDate) },
        { header: "Ends", cell: (t) => shortDate(t.endDate) },
        { header: "Status", cell: (t) => <StatusBadge status={t.isActive ? "ACTIVE" : "CLOSED"} /> },
      ]}
      toValues={(t) => ({
        name: t.name,
        startDate: t.startDate.slice(0, 10),
        endDate: t.endDate.slice(0, 10),
        isActive: String(t.isActive),
      })}
      toPayload={(v, editing) => ({
        name: v.name.trim(),
        startDate: new Date(v.startDate).toISOString(),
        endDate: new Date(v.endDate).toISOString(),
        isActive: v.isActive === "true",
        ...(!editing && { year: Number(v.year) }),
      })}
    />
  );
}

function Sections() {
  const courses = useOptions<Course>("/courses", (c) => `${c.code} · ${c.title}`);
  const terms = useOptions<Term>("/semesters", (t) => `${t.name} ${t.year}`);

  // Faculty are listed through the user list, which carries each person's faculty profile id
  const facultyQuery = useQuery({
    queryKey: ["options", "faculty"],
    queryFn: () => getPage<UserWithProfile>("/admin/users", { role: "INSTRUCTOR", limit: 100 }),
  });
  const faculty = (facultyQuery.data?.rows ?? [])
    .filter((u) => u.instructor?.id)
    .map((u) => ({ value: u.instructor!.id, label: `${u.name} (${u.instructor!.employeeId})` }));

  return (
    <ResourcePanel<Section>
      noun="section"
      endpoint="/sections"
      icon={Layers}
      schema={z.object({
        courseId: picked("Choose a course"),
        semesterId: picked("Choose a term"),
        instructorId: picked("Choose the faculty member"),
        sectionCode: text("Enter a section code, e.g. A", 1),
        capacity: wholeNumber("Enter the number of seats"),
      })}
      fields={[
        { name: "courseId", label: "Course", type: "select", options: courses, createOnly: true },
        { name: "semesterId", label: "Term", type: "select", options: terms, createOnly: true },
        { name: "instructorId", label: "Faculty", type: "select", options: faculty, placeholder: "Choose faculty" },
        { name: "sectionCode", label: "Section code", type: "text", placeholder: "A", createOnly: true },
        { name: "capacity", label: "Seats", type: "number", placeholder: "40" },
      ]}
      columns={[
        { header: "Course", cell: (s) => <><span className="font-medium text-primary">{s.course?.code}</span> {s.course?.title}</> },
        { header: "Term", cell: (s) => (s.semester ? `${s.semester.name} ${s.semester.year ?? ""}` : "—") },
        { header: "Section", cell: (s) => s.sectionCode },
        { header: "Faculty", cell: (s) => s.instructor?.user?.name ?? "—" },
        { header: "Seats", cell: (s) => s.capacity },
      ]}
      toValues={(s) => ({ capacity: String(s.capacity), instructorId: "" })}
      toPayload={(v, editing) => ({
        instructorId: v.instructorId,
        capacity: Number(v.capacity),
        ...(!editing && { courseId: v.courseId, semesterId: v.semesterId, sectionCode: v.sectionCode.trim() }),
      })}
    />
  );
}