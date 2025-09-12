import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReadOnlyStudent from "@/components/admin/global/ReadOnlyStudent";
import AccordionForm from "@/components/admin/global/AccordionForm";
import { rolesFormFields } from "./data/rolesFormFields";
import type { FieldMapperKeys } from "@/utils/fieldMapper";
import { useSubmitAcademicAdvisorForm } from "@/hooks/useSubmitAcademicAdvisorForm";
import { useAcademicAdvisorForm } from "@/hooks/useAcademicAdvisorForm";
import { useFetchStudentByCode } from "@/hooks/useFetchStudnetByNationalCode";
import { Link, useOutletContext } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { usePostReport } from "@/hooks/usePostReport";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment-jalaali";

interface User {
  id: string;
  isAdmin: boolean;
  name: string;
  permissions: string[];
  role: string;
}

const AcademicCounseling = () => {
  const user: User = useOutletContext();
  const [nationalCode, setNationalCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [message, setMessage] = useState("");
  const { data: student, isLoading, error: studentError } = useFetchStudentByCode(submittedCode);
  const { data: formData, isLoading: formLoading, error: formError } = useAcademicAdvisorForm(student?._id);
  const { mutate: submitForm, isPending: isSubmitting } = useSubmitAcademicAdvisorForm();
  const currentJalaaliDate = moment().format("jYYYY-jMM-jDD");
  const { mutate: postReport, isPending: isPosting } = usePostReport(
    student?._id || "",
    message,
    currentJalaaliDate,
    user.id
  );

  const handleSubmitCode = () => {
    if (!/^\d{10}$/.test(nationalCode)) {
      toast.error("لطفاً یک کد ملی ۱۰ رقمی معتبر وارد کنید");
      return;
    }
    setSubmittedCode(nationalCode);
  };

  const handleFormSubmit = (data: Record<FieldMapperKeys, string>) => {
    if (!student?._id) {
      toast.error("دانشجو انتخاب نشده است");
      return;
    }
    submitForm(
      { studentId: student._id, formData: data },
      {
        onSuccess: () => {
          toast.success("فرم با موفقیت ارسال شد");
        },
        onError: (err) => {
          toast.error(`خطا در ارسال فرم: ${err.message}`);
        },
      }
    );
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
        <h1 className="font-bold text-xl text-center">مشاوره تحصیلی</h1>

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
              disabled={isLoading || !/^\d{10}$/.test(nationalCode)}
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

        {student && <ReadOnlyStudent student={student} />}
        {student && (
          formLoading ? (
            <p className="text-center">در حال بارگیری فرم...</p>
          ) : formError ? (
            <p className="text-red-600 text-center">خطا در بارگیری فرم: {formError.message}</p>
          ) : (
            <AccordionForm
              fields={rolesFormFields["مشاور تحصیلی"]}
              completed={formData?.exists || false}
              values={formData?.form || {}}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          )
        )}

        {student && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="font-semibold text-md text-gray-800">ثبت گزارش مشاوره تحصیلی</h2>
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
                    placeholder="متن گزارش مشاوره تحصیلی را وارد کنید"
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
        )}

        <Link to="/admin">
          <Button>داشبورد</Button>
        </Link>
      </div>
    </div>
  );
};

export default AcademicCounseling;