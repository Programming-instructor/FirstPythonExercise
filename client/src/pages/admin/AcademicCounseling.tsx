import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Student } from "@/types/student";
import { useFetchStudentByCode } from "@/hooks/useFetchStudnetByNationalCode";
import ReadOnlyStudent from "@/components/admin/global/ReadOnlyStudent";

const AcademicCounseling = () => {
  const [nationalCode, setNationalCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const { data: student, isLoading, error } = useFetchStudentByCode(submittedCode);

  const handleSubmit = () => {
    setSubmittedCode(nationalCode);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-50 p-4" dir="rtl">
      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8">
        <h1 className="font-bold text-2xl mb-6 text-center">مشاوره تحصیلی</h1>

        <div className="mb-8">
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
            <Button onClick={handleSubmit} disabled={isLoading || !/^\d{10}$/.test(nationalCode)}>
              {isLoading ? "در حال جستجو..." : "جستجوی هنرجو"}
            </Button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">
              خطا در یافتن هنرجو: {error.message}
            </p>
          )}
          {submittedCode && !isLoading && !student && (
            <p className="text-red-600 text-sm mt-2">
              هیچ هنرجویی با این کد ملی یافت نشد.
            </p>
          )}
        </div>

        {student && <ReadOnlyStudent student={student} />}
      </div>
    </div>
  );
};

export default AcademicCounseling;