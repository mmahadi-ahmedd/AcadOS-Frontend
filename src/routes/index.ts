import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { DepartmentRoutes } from "../modules/department/department.routes";
import { ProgramRoutes } from "../modules/program/program.routes";
import { CourseRoutes } from "../modules/course/course.routes";
import { SemesterRoutes } from "../modules/semester/semester.routes";
import { SectionRoutes } from "../modules/section/section.routes";
import { EnrollmentRoutes } from "../modules/enrollment/enrollment.routes";
import { AttendanceRoutes } from "../modules/attendance/attendance.routes";
import { ExamRoutes } from "../modules/exam/exam.routes";
import { ResultRoutes } from "../modules/result/result.routes";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/departments", route: DepartmentRoutes },
  { path: "/programs", route: ProgramRoutes },
  { path: "/courses", route: CourseRoutes },
  { path: "/semesters", route: SemesterRoutes },
  { path: "/sections", route: SectionRoutes },
  { path: "/enrollments", route: EnrollmentRoutes },
  { path: "/attendance", route: AttendanceRoutes },
  { path: "/exams", route: ExamRoutes },
  { path: "/results", route: ResultRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
