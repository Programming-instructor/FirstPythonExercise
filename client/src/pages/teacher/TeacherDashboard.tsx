import { useGetTeacherClasses } from "@/hooks/useGetTeacherClasses";
import type { Teacher } from "@/types/teacher";
import { Link, useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetTeacherReports } from "@/hooks/useGetTeacherReports";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Period {
  day: string;
  period: number;
  className: string;
  periodName: string;
}
interface report {
  message: string;
  date: string;
  _id: string;
}

type Day = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

const dayMap: Record<number, Day> = {
  6: 'saturday',
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
};

const TeacherDashboard: React.FC = () => {
  const teacher = useOutletContext<Teacher>();
  const { data, isLoading } = useGetTeacherClasses(teacher.id);
  const { data: reports, isLoading: isLoadingReports } = useGetTeacherReports(teacher.id)

  if (isLoading || isLoadingReports) {
    return <div className="container mx-auto p-4">در حال بارگذاری...</div>;
  }
  console.log(reports)

  const schedule = data.reduce((acc: Record<Day, Period[]>, item: Period) => {
    const dayKey = item.day as Day;
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(item);
    return acc;
  }, {} as Record<Day, Period[]>);

  Object.keys(schedule).forEach((day) => {
    schedule[day as Day].sort((a: Period, b: Period) => a.period - b.period);
  });

  const daysOrder: Day[] = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const getDayName = (day: Day): string => {
    switch (day) {
      case 'saturday': return 'شنبه';
      case 'sunday': return 'یک‌شنبه';
      case 'monday': return 'دوشنبه';
      case 'tuesday': return 'سه‌شنبه';
      case 'wednesday': return 'چهارشنبه';
      case 'thursday': return 'پنج‌شنبه';
      case 'friday': return 'جمعه';
      default: return 'روز نامعتبر';
    }
  };

  const currentDayIndex = new Date().getDay();
  // const currentDayIndex = 6;
  const todayDay = dayMap[currentDayIndex];
  const todayPeriods: Period[] = schedule[todayDay] || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">برنامه معلم {teacher.firstName ?? ''} {teacher.lastName ?? ''}</h1>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">کلاس‌های امروز</CardTitle>
        </CardHeader>
        <CardContent>
          {todayPeriods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayPeriods.map((period, index) => (
                <Link to={`/teacher/class/${period.className}/${todayDay}/${period.period}`} key={`${todayDay}-${period.period}-${index}`}>
                  <Card className="hover:shadow-xl cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {period.className} - {period.periodName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>زنگ: {period.period}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">بدون کلاس امروز</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOrder.map((day: Day) => {
          const periods: Period[] = schedule[day] || [];
          return (
            <Card key={day} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{getDayName(day)}</CardTitle>
              </CardHeader>
              <CardContent>
                {periods.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-start">زنگ</TableHead>
                        <TableHead className="text-start">درس</TableHead>
                        <TableHead className="text-start">کلاس</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {periods.map((period: Period, index: number) => (
                        <TableRow key={`${day}-${period.period}-${index}`}>
                          <TableCell>{period.period}</TableCell>
                          <TableCell>{period.periodName}</TableCell>
                          <TableCell>{period.className}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500">بدون برنامه</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">اخطار ها</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingReports ? (
            <div className="flex justify-center items-center h-32">
              <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          ) : reports?.amount > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">تاریخ</TableHead>
                  <TableHead className="text-start">پیام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.reports.map((report: report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">بدون اخطار</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;