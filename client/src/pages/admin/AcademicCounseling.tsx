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
import { Link } from "react-router-dom";

const AcademicCounseling = () => {
  const [nationalCode, setNationalCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const { data: student, isLoading, error: studentError } = useFetchStudentByCode(submittedCode);
  const { data: formData, isLoading: formLoading, error: formError } = useAcademicAdvisorForm(student?._id);
  const { mutate: submitForm, isPending: isSubmitting } = useSubmitAcademicAdvisorForm();

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

  return (
    <div className="flex flex-col items-center min-h-screen p-4" dir="rtl">
      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8 space-y-8">
        <h1 className="font-bold text-2xl text-center">مشاوره تحصیلی</h1>

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

        <Link to="/admin">
          <Button>داشبورد</Button>
        </Link>
      </div>
    </div>
  );
};

export default AcademicCounseling;