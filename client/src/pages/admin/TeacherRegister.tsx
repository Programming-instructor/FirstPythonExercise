import { useState } from "react";
import { CgDanger } from "react-icons/cg";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useTeacherRegister } from "@/hooks/useTeacherRegister";
import type { TeacherFormData } from "@/types/teacher";

const TeacherRegister = () => {
  const [formData, setFormData] = useState<TeacherFormData>({
    mobile: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    birth_certificate_number: "",
    national_code: "",
    subjects: [],
    academic_year: "",
    academic_level: 'high_school_diploma',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subjectsInput, setSubjectsInput] = useState<string>("");

  const { mutate, isPending } = useTeacherRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubjectsInput(value);
    setFormData((prev) => ({
      ...prev,
      subjects: value ? value.split("،").map((s) => s.trim()) : [],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDateChange = (date: any) => {
    if (date && date.isValid) {
      const jalaliDateStr = date.format("YYYY-MM-DD");
      setFormData((prev) => ({ ...prev, birth_date: jalaliDateStr }));
    } else {
      setFormData((prev) => ({ ...prev, birth_date: "" }));
    }
  };

  const isFormComplete = () => {
    const requiredFields: (keyof TeacherFormData)[] = [
      "first_name",
      "last_name",
      "birth_date",
      "birth_certificate_number",
      "national_code",
      "academic_year",
      "academic_level",
    ];
    return requiredFields.every((field) => formData[field] !== undefined && formData[field] !== "");
  };

  const handleSubmit = () => {
    mutate(
      { formData, imageFile },
      {
        onSuccess: () => {
          setFormData({
            mobile: "",
            first_name: "",
            last_name: "",
            birth_date: "",
            birth_certificate_number: "",
            national_code: "",
            subjects: [],
            academic_year: "",
            academic_level: "high_school_diploma",
          });
          setImageFile(null);
          setImagePreview(null);
          setSubjectsInput("");
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center" dir="rtl">
      <div className="flex flex-col gap-5 bg-neutral-50 px-8 py-12 shadow rounded-2xl w-full max-w-5xl">
        <h1 className="font-bold text-2xl m-auto">فرم ثبت‌نام اولیه معلم</h1>

        {/* Important Notes */}
        <h3 className="font-semibold text-sm">اطلاعات هویتی</h3>
        <div className="bg-neutral-100 border p-3 w-fit max-w-2xl rounded-lg text-xs space-y-2.5">
          <h4 className="text-xs text-red-800">توجه مهم</h4>
          <ul>
            <li className="leading-6">تکمیل تمامی فیلدهای الزامی ضروری است.</li>
            <li className="leading-6">کد ملی باید دقیقاً ۱۰ رقم باشد و منحصربه‌فرد باشد.</li>
          </ul>
          <div className="bg-red-50 border border-red-200 p-3 w-full rounded-lg text-xs">
            <p className="flex items-center justify-center gap-1 text-red-800 font-bold">
              <CgDanger size={20} className="text-red-700" />
              تا زمانی که اطلاعات کامل وارد نشده باشند، دکمه ثبت اطلاعات غیرفعال خواهد بود.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">اطلاعات شخصی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="first_name">نام</Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="last_name">نام خانوادگی</Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="national_code">کد ملی</Label>
                <Input id="national_code" name="national_code" value={formData.national_code} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="birth_date">تاریخ تولد</Label>
                <DatePicker
                  id="birth_date"
                  calendar={persian}
                  locale={persian_fa}
                  value={formData.birth_date}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  containerStyle={{ width: "100%" }}
                  inputClass="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  calendarPosition="bottom-right"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="birth_certificate_number">شماره شناسنامه</Label>
                <Input
                  id="birth_certificate_number"
                  name="birth_certificate_number"
                  value={formData.birth_certificate_number}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="mobile">شماره موبایل</Label>
                <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">اطلاعات حرفه‌ای</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="subjects">دروس تدریسی (با کاما جدا کنید)</Label>
                <Input
                  id="subjects"
                  name="subjects"
                  value={subjectsInput}
                  onChange={handleSubjectsChange}
                  placeholder="مثال: ریاضی، فیزیک، شیمی"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="academic_year">سال تحصیلی</Label>
                <Input id="academic_year" name="academic_year" value={formData.academic_year} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="academic_level">وضعیت تحصیلی</Label>
                <Select
                  onValueChange={(v) => handleSelectChange("academic_level", v)}
                  value={formData.academic_level}
                >
                  <SelectTrigger id="academic_level" className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="high_school_diploma">دیپلم دبیرستان</SelectItem>
                    <SelectItem value="teaching_diploma">دیپلم/مدرک آموزش</SelectItem>
                    <SelectItem value="associate_degree">فوق دیپلم</SelectItem>
                    <SelectItem value="bachelor_degree">لیسانس</SelectItem>
                    <SelectItem value="master_degree">فوق لیسانس</SelectItem>
                    <SelectItem value="doctoral_degree">دکتری</SelectItem>
                    <SelectItem value="postdoctoral">پسادکتری</SelectItem>
                    <SelectItem value="other_certification">سایر مدارک</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Portrait Upload */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="teacher_portrait_front">عکس پرسنلی</Label>
            <div className="relative w-32 h-32 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center overflow-hidden">
              <input
                id="teacher_portrait_front"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FaCamera className="text-neutral-500 text-3xl" />
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-start gap-4 mt-8">
          <Button asChild variant="outline">
            <Link to="/admin/dashboard">بازگشت به داشبورد</Link>
          </Button>
          <Button disabled={isPending || !isFormComplete()} onClick={handleSubmit}>
            {isPending ? "در حال ثبت..." : "ثبت معلم"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;