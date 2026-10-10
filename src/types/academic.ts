export interface CourseLite {
  code: string;
  title: string;
  creditHours: number;
}

export interface SectionRow {
  id: string;
  sectionCode?: string;
  name?: string;
  capacity?: number;
  course: CourseLite;
  semester?: { name?: string };
  instructor?: { user?: { name: string } };
  _count?: { enrollments: number };
}

export interface EnrollmentRow {
  id: string;
  status: string;
  section: SectionRow;
}

export interface FeeRow {
  id: string;
  amount: number | string;
  status: string;
  createdAt: string;
  semester?: { name?: string };
}