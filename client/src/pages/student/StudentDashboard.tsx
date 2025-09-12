import { useGetClassByName } from "@/hooks/useGetClassByName";
import { useGetConfirmedReports } from "@/hooks/useGetConfirmedReports";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
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
  nCode: string;
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

interface User {
  _id: string;
  role: string;
  name: string;
}

interface Report {
  reportId: string;
  date: string;
  message: string;
  confirmed: boolean;
  from: User;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    national_code: string;
  };
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
  const { data: confirmedData } = useGetConfirmedReports(student.nCode);

  const classData = cls as ClassData | undefined;
  const confirmedReports = confirmedData as { reports: Report[]; attendanceSummary: { present: number; absent: number; late: number }; attendanceRecords: any[] } | undefined;

  const roleTranslations: { [key: string]: string } = {
    admin: 'ادمین',
    academicAdvisor: 'مشاور تحصیلی',
    educationalDeputy: 'معاونت آموزشی',
    principal: 'مدیر',
    psychCounselor: 'مشاور روانکاوی',
    disciplinaryDeputy: 'معاونت انضباطی'
  };

  const attendanceTranslations: { [key: string]: string } = {
    present: 'حاضر',
    absent: 'غایب',
    late: 'تاخیر'
  };

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
    <div className="container mx-auto p-4 sm:p-6 space-y-8">
      <Card>
        <CardContent>
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-right">برنامه کلاسی</h2>
          <div className="overflow-x-auto">
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
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-right">گزارش‌ها</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {confirmedReports?.reports && confirmedReports.reports.length > 0 ? (
            confirmedReports.reports.map((report) => (
              <Card key={report.reportId} className="text-right">
                <CardHeader>
                  <CardTitle className="text-base sm:text-md">تاریخ: {report.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{report.message}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs  text-neutral-700">
                    از: {report.from.name} ({roleTranslations[report.from.role] || report.from.role})
                  </p>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-center col-span-full">هیچ گزارشی یافت نشد</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-right">حضور و غیاب</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="font-semibold">تعداد حضور</div>
              <div className="text-lg sm:text-xl">{confirmedReports?.attendanceSummary.present || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="font-semibold">تعداد غیبت</div>
              <div className="text-lg sm:text-xl">{confirmedReports?.attendanceSummary.absent || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="font-semibold">تعداد تاخیر</div>
              <div className="text-lg sm:text-xl">{confirmedReports?.attendanceSummary.late || 0}</div>
            </CardContent>
          </Card>
        </div>
        {confirmedReports?.attendanceRecords.length === 0 ? (
          <p className="text-center text-gray-500">هیچ سابقه حضور و غیابی یافت نشد.</p>
        ) : (
          <div className="space-y-4">
            {confirmedReports?.attendanceRecords.map((att: any, index: number) => (
              <Card key={index} className="shadow-sm text-right">
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold text-gray-800">تاریخ: {att.date}</div>
                  <div className="text-gray-700">درس: {att.subject}</div>
                  <div className="text-gray-700">وضعیت: {attendanceTranslations[att.status] || att.status}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;