import { useState } from "react";
import { CgDanger } from "react-icons/cg";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "@/lib/axiosConfig";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const StudentRegister = () => {
  const [formData, setFormData] = useState<Record<string, any>>({
    guardian: { name: "", relation: "", phone: "" },
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("guardian.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        guardian: { ...prev.guardian, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const requiredFields = [
      "first_name", "last_name", "father_name", "mother_name", "national_code",
      "birth_date", "birth_certificate_number", "student_phone", "father_phone",
      "father_job", "mother_phone", "mother_job", "academic_year", "education_level",
      "emergency_phone", "marital_status", "previous_school_address", "home_address",
      "residence_status", "postal_code", "home_phone", "student_goal", "academic_status",
    ];
    const isBasicFieldsComplete = requiredFields.every((field) => formData[field] !== undefined && formData[field] !== "");
    const isGuardianComplete = !formData.guardian.phone || (formData.guardian.name && formData.guardian.relation);
    return isBasicFieldsComplete && isGuardianComplete;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "guardian") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) {
        data.append("portrait", imageFile);
      }

      await api.post("/student", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("هنرجو با موفقیت ثبت شد");
      setFormData({ guardian: { name: "", relation: "", phone: "" } });
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err.message || "خطا در ثبت هنرجو");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center" dir="rtl">
      <div className="flex flex-col gap-5 bg-neutral-50 px-8 py-12 shadow rounded-2xl w-full max-w-5xl">
        <h1 className="font-bold text-2xl m-auto">فرم ثبت‌ نام اولیه هنرجو</h1>

        {/* Important Notes */}
        <h3 className="font-semibold text-sm">اطلاعات هویتی</h3>
        <div className="bg-neutral-100 border p-3 w-fit max-w-2xl rounded-lg text-xs space-y-2.5">
          <h4 className="text-xs text-red-800">توجه مهم</h4>
          <ul>
            <li className="leading-6">تکمیل تمامی فیلدهای شماره موبایل الزامی است.</li>
            <li className="leading-6">شماره موبایل هنرجو باید منحصربه‌فرد باشد.</li>
            <li className="leading-6">برای والدین یا اقوام، تکرار شماره مجاز است.</li>
          </ul>
          <div className="bg-red-50 border border-red-200 p-3 w-full rounded-lg text-xs">
            <p className="flex items-center justify-center gap-1 text-red-800 font-bold">
              <CgDanger size={20} className="text-red-700" />
              تا زمانی که اطلاعات کامل وارد نشده باشند، دکمه ثبت اطلاعات غیرفعال خواهد بود.
            </p>
          </div>
        </div>

        {/* Excel Upload Info */}
        <div className="bg-blue-50 rounded border border-blue-100 p-3 text-xs space-y-2.5">
          <h4 className="text-xs font-bold">ثبت دسته‌جمعی هنرجویان با فایل Excel:</h4>
          <p>برای وارد کردن همزمان چندین هنرجو، از بخش بارگذاری فایل Excel استفاده کنید。</p>
          <p>
            جهت بارگذاری گروهی به{" "}
            <Link to={"/admin/students"} className="text-blue-600 underline">
              صفحه لیست هنرجویان
            </Link>{" "}
            مراجعه کنید。
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">اطلاعات شخصی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="first_name">نام</Label>
                <Input id="first_name" name="first_name" value={formData.first_name || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="last_name">نام خانوادگی</Label>
                <Input id="last_name" name="last_name" value={formData.last_name || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="national_code">کد ملی</Label>
                <Input id="national_code" name="national_code" value={formData.national_code || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="birth_date">تاریخ تولد</Label>
                <DatePicker
                  id="birth_date"
                  calendar={persian}
                  locale={persian_fa}
                  value={formData.birth_date || ""}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  containerStyle={{ width: "100%" }}
                  inputClass="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  calendarPosition="bottom-right"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="birth_certificate_number">شماره شناسنامه</Label>
                <Input id="birth_certificate_number" name="birth_certificate_number" value={formData.birth_certificate_number || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="marital_status">وضعیت تأهل پدر و مادر</Label>
                <Select onValueChange={(v) => handleSelectChange("marital_status", v)} value={formData.marital_status}>
                  <SelectTrigger id="marital_status" className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="single">مجرد</SelectItem>
                    <SelectItem value="married">متاهل</SelectItem>
                    <SelectItem value="divorced">طلاق گرفته</SelectItem>
                    <SelectItem value="widowed">بیوه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">اطلاعات خانوادگی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="father_name">نام پدر</Label>
                <Input id="father_name" name="father_name" value={formData.father_name || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="father_job">شغل پدر</Label>
                <Input id="father_job" name="father_job" value={formData.father_job || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="father_phone">شماره موبایل پدر</Label>
                <Input id="father_phone" name="father_phone" value={formData.father_phone || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="mother_name">نام مادر</Label>
                <Input id="mother_name" name="mother_name" value={formData.mother_name || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="mother_job">شغل مادر</Label>
                <Input id="mother_job" name="mother_job" value={formData.mother_job || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="mother_phone">شماره موبایل مادر</Label>
                <Input id="mother_phone" name="mother_phone" value={formData.mother_phone || ""} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">اطلاعات ولی قانونی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="guardian_name">نام ولی قانونی</Label>
                <Input id="guardian_name" name="guardian.name" value={formData.guardian.name || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="guardian_relation">نسبت با هنرجو</Label>
                <Input id="guardian_relation" name="guardian.relation" value={formData.guardian.relation || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="guardian_phone">شماره موبایل ولی قانونی</Label>
                <Input id="guardian_phone" name="guardian.phone" value={formData.guardian.phone || ""} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">اطلاعات تماس</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="student_phone">شماره موبایل هنرجو</Label>
                <Input id="student_phone" name="student_phone" value={formData.student_phone || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="emergency_phone">شماره اضطراری</Label>
                <Input id="emergency_phone" name="emergency_phone" value={formData.emergency_phone || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="home_phone">تلفن منزل</Label>
                <Input id="home_phone" name="home_phone" value={formData.home_phone || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="home_address">آدرس منزل</Label>
                <Textarea id="home_address" name="home_address" value={formData.home_address || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="postal_code">کد پستی</Label>
                <Input id="postal_code" name="postal_code" value={formData.postal_code || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="residence_status">وضعیت سکونت</Label>
                <Select onValueChange={(v) => handleSelectChange("residence_status", v)} value={formData.residence_status}>
                  <SelectTrigger id="residence_status" className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="مالک">مالک</SelectItem>
                    <SelectItem value="مستاجر">مستاجر</SelectItem>
                    <SelectItem value="سایر">سایر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">اطلاعات تحصیلی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="academic_year">سال تحصیلی</Label>
                <Input id="academic_year" name="academic_year" value={formData.academic_year || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="education_level">پایه تحصیلی</Label>
                <Select onValueChange={(v) => handleSelectChange("education_level", v)} value={formData.education_level}>
                  <SelectTrigger id="education_level" className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="10">دهم شبکه‌های کامپیوتری</SelectItem>
                    <SelectItem value="11">یازدهم شبکه‌های کامپیوتری</SelectItem>
                    <SelectItem value="12">دوازدهم شبکه‌های کامپیوتری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="grade">آخرین معدل</Label>
                <Input id="grade" type="number" name="grade" value={formData.grade || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="previous_school_address">آدرس مدرسه قبلی</Label>
                <Textarea id="previous_school_address" name="previous_school_address" value={formData.previous_school_address || ""} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="academic_status">وضعیت تحصیلی</Label>
                <Select onValueChange={(v) => handleSelectChange("academic_status", v)} value={formData.academic_status}>
                  <SelectTrigger id="academic_status" className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="high">عالی</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">ضعیف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="student_goal">هدف هنرجو</Label>
                <Input id="student_goal" name="student_goal" value={formData.student_goal || ""} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Portrait Upload */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="portrait">عکس پرسنلی</Label>
          <div className="relative w-32 h-32 bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center overflow-hidden">
            <input
              id="portrait"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCamera className="text-neutral-500 text-3xl" />
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-start gap-4 mt-8">
          <Button asChild variant="outline">
            <Link to="/admin/dashboard">بازگشت به داشبورد</Link>
          </Button>
          <Button disabled={loading || !isFormComplete()} onClick={handleSubmit}>
            {loading ? "در حال ثبت..." : "ثبت هنرجو"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;