import { useGetClassByName } from "@/hooks/useGetClassByName";
import { useGetStudentReports } from "@/hooks/useGetStudentReports";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Stdnt {
  id: string;
  student_phone: number;
  firstName: string;
  lastName: string;
  cls: string;
}

interface Teacher {
  _id: string;
  mobile: string;
  first_name: string;
  last_name: string;
}

interface DaySchedule {
  subject: string;
  teacher: Teacher;
  _id: string;
}

interface StudentInClass {
  _id: string;
  first_name: string;
  last_name: string;
  national_code: string;
}

interface ClassData {
  _id: string;
  name: string;
  level: string;
  days: {
    saturday: DaySchedule[];
    sunday: DaySchedule[];
    monday: DaySchedule[];
    tuesday: DaySchedule[];
    wednesday: DaySchedule[];
    thursday: DaySchedule[];
    friday: DaySchedule[];
  };
  students: StudentInClass[];
}

interface Report {
  date: string;
  message: string;
  _id: string;
}

interface ReportsData {
  amount: number;
  reports: Report[];
}

const dayMap: Record<keyof ClassData["days"], string> = {
  saturday: "شنبه",
  sunday: "یکشنبه",
  monday: "دوشنبه",
  tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه",
  thursday: "پنج‌شنبه",
  friday: "جمعه",
};

const StudentDashboard = () => {
  const student: Stdnt = useOutletContext();
  const { data: cls } = useGetClassByName(student.cls);
  const { data: reportsData } = useGetStudentReports(student.id);

  const classData = cls as ClassData | undefined;
  const reports = reportsData as ReportsData | undefined;

  const scheduleItems: { day: string; subject: string; teacher: string }[] = [];

  if (classData) {
    Object.entries(classData.days).forEach(([dayKey, schedules]) => {
      const persianDay = dayMap[dayKey as keyof ClassData["days"]];
      schedules.forEach((schedule) => {
        const teacherName = `${schedule.teacher.first_name} ${schedule.teacher.last_name}`;
        scheduleItems.push({
          day: persianDay,
          subject: schedule.subject,
          teacher: teacherName,
        });
      });
    });
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-right">برنامه کلاسی</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">روز</TableHead>
              <TableHead className="text-right">درس</TableHead>
              <TableHead className="text-right">معلم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleItems.length > 0 ? (
              scheduleItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{item.day}</TableCell>
                  <TableCell className="text-right">{item.subject}</TableCell>
                  <TableCell className="text-right">{item.teacher}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  هیچ برنامه‌ای یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-right">گزارش‌ها</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports?.reports && reports.reports.length > 0 ? (
            reports.reports.map((report) => (
              <Card key={report._id} className="text-right">
                <CardHeader>
                  <CardTitle>تاریخ: {report.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{report.message}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center col-span-full">هیچ گزارشی یافت نشد</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;