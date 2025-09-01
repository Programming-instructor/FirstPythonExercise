import { useGetClassByName } from "@/hooks/useGetClassByName";
import { useGetAttendance } from "@/hooks/useGetAttendance";
import { useSubmitAttendance } from "@/hooks/useSubmitAttendance";
import { Link, useParams } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import moment from "moment-jalaali";
import type { Attendance, AttendanceInput, Days, Period, Student } from "@/types/class";

const dayMap: { [key: string]: string } = {
  saturday: "شنبه",
  sunday: "یکشنبه",
  monday: "دوشنبه",
  tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه",
  thursday: "پنج‌شنبه",
  friday: "جمعه",
};

const TeacherClass = () => {
  const { classname, day, period } = useParams<{
    classname: string;
    day: string;
    period: string;
  }>();
  const periodNum = period ? parseInt(period, 10) : NaN;
  const { data: classData } = useGetClassByName(classname || "");
  const classId: string | undefined = classData?._id;
  const today: string = moment().locale("fa").local().format("jYYYY-jMM-jDD");

  // Fetch existing attendance using the new hook
  const { data: attendanceData, isLoading: isAttendanceLoading } = useGetAttendance(
    classId,
    today,
    day,
    period
  );

  const existing: Attendance | null = attendanceData?.[0] || null;
  const students: Student[] = classData?.students || [];

  // State for attendances and report
  const [attendances, setAttendances] = useState<AttendanceInput[]>([]);
  const [report, setReport] = useState<string>("");

  // Set default attendances when students load and no existing
  useEffect(() => {
    if (!existing && students.length > 0 && attendances.length === 0) {
      setAttendances(
        students.map((s) => ({
          studentId: s._id,
          status: "present" as const,
        }))
      );
    }
  }, [students, existing, attendances.length]);

  // Prefill if existing attendance
  useEffect(() => {
    if (existing) {
      setAttendances(
        existing.studentsAttendance.map((sa) => ({
          studentId: sa.student._id,
          status: sa.status,
        }))
      );
      setReport(existing.report || "");
    }
  }, [existing]);

  // Handle status change
  const handleStatusChange = (
    studentId: string,
    newStatus: "present" | "absent" | "late"
  ) => {
    setAttendances((prev) =>
      prev.map((a) =>
        a.studentId === studentId ? { ...a, status: newStatus } : a
      )
    );
  };

  // Mutation to post/update attendance using the new hook
  const mutation = useSubmitAttendance();

  // Conditional rendering
  if (!classId) {
    return <div>شناسه کلاس نامعتبر است</div>;
  }

  if (!classname || !day || !period) {
    return <div>پارامترهای缺失</div>;
  }

  if (isNaN(periodNum)) {
    return <div>شماره زنگ نامعتبر</div>;
  }

  if (!classData) {
    return <div>در حال بارگیری اطلاعات کلاس...</div>;
  }

  const schedule: Period | undefined = classData.days[day as keyof Days]?.[
    periodNum - 1
  ];

  const translatedDay = dayMap[day] || day;

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <Card className="gap-1">
        <CardHeader>
          <CardTitle className="flex gap-3 flex-col">
            <span className="text-xl">
              <span>کلاس {classname}</span>
              {" - "}
              <span>زنگ {period}</span>
            </span>
            <span className="flex gap-1 font-normal">
              <span>{translatedDay}</span>|<span>{today}</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedule ? (
            <p>درس: {schedule.subject}</p>
          ) : (
            <p>برنامه‌ای برای این زنگ یافت نشد.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>حضور و غیاب دانش آموزان</CardTitle>
        </CardHeader>
        <CardContent>
          {isAttendanceLoading ? (
            <p>در حال بارگیری حضور و غیاب...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">نام</TableHead>
                  <TableHead className="text-start">کد ملی</TableHead>
                  <TableHead className="text-start">وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const att = attendances.find(
                    (a) => a.studentId === student._id
                  );
                  return (
                    <TableRow key={student._id}>
                      <TableCell>
                        {student.first_name} {student.last_name}
                      </TableCell>
                      <TableCell>{student.national_code}</TableCell>
                      <TableCell>
                        <Select
                          value={att?.status}
                          onValueChange={(val: "present" | "absent" | "late") =>
                            handleStatusChange(student._id, val)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="انتخاب وضعیت" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">حاضر</SelectItem>
                            <SelectItem value="absent">غایب</SelectItem>
                            <SelectItem value="late">تأخیر</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>گزارش</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={report}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setReport(e.target.value)
            }
            placeholder="گزارش کلاس را اینجا بنویسید..."
            rows={5}
          />
        </CardContent>
      </Card>

      <Link to={"/teacher"}>
        <Button className="w-full sm:w-auto ml-1" variant={"outline"}>
          داشبورد
        </Button>
      </Link>
      <Button
        onClick={() =>
          mutation.mutate({
            classId,
            date: today,
            day,
            period: periodNum,
            attendances,
            report,
          })
        }
        disabled={mutation.isPending || !classId || !day || !period}
        className="w-full sm:w-auto"
      >
        {mutation.isPending ? "در حال ارسال..." : "ارسال حضور و غیاب"}
      </Button>
    </div>
  );
};

export default TeacherClass;