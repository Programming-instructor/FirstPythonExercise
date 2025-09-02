import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReadOnlyStudent from "@/components/admin/global/ReadOnlyStudent";
import { useFetchStudentByCode } from "@/hooks/useFetchStudnetByNationalCode";
import { usePostReport } from "@/hooks/usePostReport";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment-jalaali";

const DisciplinaryDeputyStudent = () => {
  const [nationalCode, setNationalCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [message, setMessage] = useState("");
  const { data: student, isLoading, error: studentError } = useFetchStudentByCode(submittedCode);
  const currentJalaaliDate = moment().format("jYYYY-jMM-jDD"); // e.g., 1404-11-01
  const { mutate: postReport, isPending: isPosting } = usePostReport(
    student?._id || "",
    message,
    currentJalaaliDate
  );

  const handleSubmitCode = () => {
    if (!/^\d{10}$/.test(nationalCode)) {
      toast.error("لطفاً یک کد ملی ۱۰ رقمی معتبر وارد کنید");
      return;
    }
    setSubmittedCode(nationalCode);
  };

  const handleSubmitReport = () => {
    if (!message) {
      toast.error("لطفاً متن گزارش را وارد کنید");
      return;
    }
    postReport(undefined, {
      onSuccess: () => {
        toast.success("گزارش با موفقیت ثبت شد");
        setMessage("");
      },
      onError: (error) => {
        toast.error(`خطا در ثبت گزارش: ${error.message}`);
      },
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4" dir="rtl">
      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8 space-y-8">
        <h1 className="font-bold text-2xl text-center text-gray-800">معاونت انضباطی</h1>

        <div className="space-y-4">
          <Label htmlFor="national_code" className="text-sm font-semibold text-gray-700">
            کد ملی هنرجو
          </Label>
          <div className="flex gap-4 items-center">
            <Input
              id="national_code"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              placeholder="کد ملی ۱۰ رقمی را وارد کنید"
              className="max-w-md border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSubmitCode}
              disabled={isLoading || !/^\d{10}$/.test(nationalCode)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "در حال جستجو..." : "جستجوی هنرجو"}
            </Button>
          </div>
          {studentError && (
            <p className="text-red-600 text-sm mt-2">
              خطا در یافتن هنرجو: {studentError.message}
            </p>
          )}
          {submittedCode && !isLoading && !student && (
            <p className="text-red-600 text-sm mt-2">
              هیچ هنرجویی با این کد ملی یافت نشد.
            </p>
          )}
        </div>

        {student && (
          <>
            <ReadOnlyStudent short student={student} />
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <h2 className="font-semibold text-lg text-gray-800">ثبت گزارش انضباطی</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      تاریخ گزارش
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{currentJalaaliDate}</p>
                  </div>
                  <div>
                    <Label htmlFor="report_message" className="text-sm font-semibold text-gray-700">
                      متن گزارش
                    </Label>
                    <Textarea
                      id="report_message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="متن گزارش انضباطی را وارد کنید"
                      className="mt-2 min-h-[100px] border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitReport}
                    disabled={isPosting || !message}
                    className="w-full "
                  >
                    {isPosting ? "در حال ثبت..." : "ثبت گزارش"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Link to="/admin">
          <Button variant={"outline"}>
            بازگشت به داشبورد
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DisciplinaryDeputyStudent;