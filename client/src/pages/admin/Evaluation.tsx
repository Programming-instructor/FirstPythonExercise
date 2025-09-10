import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ReadOnlyStudent from "@/components/admin/global/ReadOnlyStudent";
import { useFetchDecisionsByNationalCode } from "@/hooks/useDecisionsByNationalCode";
import { useFetchStudentByCode } from "@/hooks/useFetchStudnetByNationalCode";
import { useGetStudentReports } from "@/hooks/useGetStudentReports";
import { useGetStudentAttendance } from "@/hooks/useGetStudentAttendance";

interface User {
  id: string;
  isAdmin: boolean;
  name: string;
  permissions: string[];
  role: string;
}

interface Report {
  _id: string;
  date: string;
  from: User;
  message: string;
}

const Evaluation = () => {
  const [nationalCode, setNationalCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const { data: student, isLoading: studentLoading, error: studentError } = useFetchStudentByCode(submittedCode);
  const { data: decisions, isLoading: decisionsLoading } = useFetchDecisionsByNationalCode(submittedCode);
  const { data: reportsData } = useGetStudentReports(submittedCode);
  const { data: attendanceData } = useGetStudentAttendance(submittedCode);

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

  const isTableFull = decisions && Object.values(decisions).every((status) => status !== null);

  const handleSubmitCode = () => {
    if (!/^\d{10}$/.test(nationalCode)) {
      toast.error("لطفاً یک کد ملی ۱۰ رقمی معتبر وارد کنید");
      return;
    }
    setSubmittedCode(nationalCode);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4" dir="rtl">
      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8 space-y-8">
        <h1 className="font-bold text-2xl text-center">ارزیابی</h1>

        <div>
          <Label htmlFor="national_code" className="text-sm font-semibold">
            کد ملی هنرجو
          </Label>
          <div className="flex gap-4 mt-2">
            <Input
              id="national_code"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              placeholder="کد ملی ۱۰ رقمی را وارد کنید"
              className="max-w-md"
            />
            <Button
              onClick={handleSubmitCode}
              disabled={studentLoading || !/^\d{10}$/.test(nationalCode)}
            >
              {studentLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال جستجو...</span>
                </div>
              ) : (
                "جستجوی هنرجو"
              )}
            </Button>
          </div>
          {studentError && (
            <p className="text-red-600 text-sm mt-2">
              خطا در یافتن هنرجو: {studentError.message}
            </p>
          )}
          {submittedCode && !studentLoading && !student && (
            <p className="text-red-600 text-sm mt-2">
              هیچ هنرجویی با این کد ملی یافت نشد.
            </p>
          )}
        </div>

        {student && <ReadOnlyStudent student={student} short />}

        {submittedCode && (
          <Card className="">
            <CardContent className="p-6">
              <Table className="w-full min-w-full overflow-visible">
                <TableCaption className="text-gray-600">تصمیمات ارزیابی</TableCaption>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 text-start">نقش</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-start">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decisionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-10">
                        <div className="flex justify-center items-center gap-2 text-gray-500">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>در حال بارگذاری...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    Object.entries(decisions || {}).map(([role, status]) => (
                      <TableRow
                        key={role}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell className="text-gray-800">
                          {roleTranslations[role] || role}
                        </TableCell>
                        <TableCell className={`${status === true ? 'text-green-700' : status === false ? 'text-red-600' : 'text-gray-600'}`}>
                          {status === true ? 'تأیید شده' : status === false ? 'رد شده' : 'تعریف نشده'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {isTableFull && (
                    <TableRow className="hover:bg-gray-50 transition-colors duration-200">
                      <TableCell className="text-gray-800 font-semibold">وضعیت نهایی</TableCell>
                      <TableCell className={`font-bold ${student.accepted === true ? 'text-green-600' : student.accepted === false ? 'text-red-600' : 'text-gray-600'}`}>
                        {student.accepted ? 'پذیرفته شده' : 'پذیرفته نشده'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {submittedCode && reportsData && (
          <div className="mt-8">
            <h2 className="font-bold text-xl text-center mb-4">گزارش‌ها</h2>
            <p className="text-center text-gray-700 mb-6">تعداد گزارش‌ها: {reportsData.amount}</p>
            {reportsData.amount === 0 ? (
              <p className="text-center text-gray-500">هیچ گزارشی یافت نشد.</p>
            ) : (
              <div className="space-y-4">
                {reportsData.reports.map((report: Report) => (
                  <Card key={report._id} className="shadow-sm">
                    <CardContent className="p-4 space-y-2">
                      <div className="font-semibold text-gray-800">تاریخ: {report.date}</div>
                      <div className="text-gray-700">پیام: {report.message}</div>
                      <div className="text-gray-700">
                        از: {report.from.name} ({roleTranslations[report.from.role] || report.from.role})
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {submittedCode && attendanceData && (
          <div className="mt-8">
            <h2 className="font-bold text-xl text-center mb-4">حضور و غیاب</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">تعداد حضور</div>
                  <div className="text-2xl">{attendanceData.numOfPres}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">تعداد غیبت</div>
                  <div className="text-2xl">{attendanceData.numOfAbs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">تعداد تاخیر</div>
                  <div className="text-2xl">{attendanceData.numOfLate}</div>
                </CardContent>
              </Card>
            </div>
            {attendanceData.fullAttendance.length === 0 ? (
              <p className="text-center text-gray-500">هیچ سابقه حضور و غیابی یافت نشد.</p>
            ) : (
              <div className="space-y-4">
                {attendanceData.fullAttendance.map((att: any, index: number) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-4 space-y-2">
                      <div className="font-semibold text-gray-800">تاریخ: {att.date}</div>
                      <div className="text-gray-700">درس: {att.subject}</div>
                      <div className="text-gray-700">معلم: {att.teacher.first_name} {att.teacher.last_name}</div>
                      <div className="text-gray-700">وضعیت: {attendanceTranslations[att.attendance] || att.attendance}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <Link to="/admin">
          <Button>داشبورد</Button>
        </Link>
      </div>
    </div>
  );
};

export default Evaluation;