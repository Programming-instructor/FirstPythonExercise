import type { Student } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ReadOnlyStudent = ({ student, short }: { student: Student, short?: boolean }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">اطلاعات هویتی</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex gap-4 items-center mb-3">
            {student.student_portrait_front ? (
              <Avatar className="w-24 h-24">
                <AvatarImage src={`${import.meta.env.VITE_IMG_BASE_URL}${student.student_portrait_front.url}`} alt="Student portrait" className="object-cover" />
                <AvatarFallback>{student.first_name[0]}{student.last_name[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <span>عکسی آپلود نشده است</span>
            )}
          </div>
          <div>
            <span className="font-medium">نام:</span> {student.first_name}
          </div>
          <div>
            <span className="font-medium">نام خانوادگی:</span> {student.last_name}
          </div>
          <div>
            <span className="font-medium">کد ملی:</span> {student.national_code}
          </div>
          {
            !short ? (
              <>
                <div>
                  <span className="font-medium">تاریخ تولد:</span> {student.birth_date}
                </div>
                <div>
                  <span className="font-medium">شماره شناسنامه:</span> {student.birth_certificate_number}
                </div>
                <div>
                  <span className="font-medium">وضعیت تأهل والدین:</span>{" "}
                  {student.marital_status === "single" ? "مجرد" :
                    student.marital_status === "married" ? "متاهل" :
                      student.marital_status === "divorced" ? "طلاق گرفته" : "بیوه"}
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="font-medium">شماره موبایل مادر:</span> {student.mother_phone}
                </div>
                <div>
                  <span className="font-medium">شماره موبایل مادر:</span> {student.mother_phone}
                </div>
                <div>
                  <span className="font-medium">شماره موبایل هنرجو:</span> {student.student_phone}
                </div>
              </>
            )
          }
        </CardContent>
      </Card>

      {
        !short && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">اطلاعات خانوادگی</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">نام پدر:</span> {student.father_name}
                </div>
                <div>
                  <span className="font-medium">شغل پدر:</span> {student.father_job}
                </div>
                <div>
                  <span className="font-medium">شماره موبایل پدر:</span> {student.father_phone}
                </div>
                <div>
                  <span className="font-medium">نام مادر:</span> {student.mother_name}
                </div>
                <div>
                  <span className="font-medium">شغل مادر:</span> {student.mother_job}
                </div>
                <div>
                  <span className="font-medium">شماره موبایل مادر:</span> {student.mother_phone}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">اطلاعات ولی قانونی</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">نام ولی:</span> {student.guardian.name || "مشخص نشده"}
                </div>
                <div>
                  <span className="font-medium">نسبت با هنرجو:</span> {student.guardian.relation || "مشخص نشده"}
                </div>
                <div>
                  <span className="font-medium">شماره موبایل ولی:</span> {student.guardian.phone || "مشخص نشده"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">اطلاعات تماس</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">شماره موبایل هنرجو:</span> {student.student_phone}
                </div>
                <div>
                  <span className="font-medium">شماره اضطراری:</span> {student.emergency_phone}
                </div>
                <div>
                  <span className="font-medium">تلفن منزل:</span> {student.home_phone}
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="font-medium">آدرس منزل:</span> {student.home_address}
                </div>
                <div>
                  <span className="font-medium">کد پستی:</span> {student.postal_code}
                </div>
                <div>
                  <span className="font-medium">وضعیت سکونت:</span>{" "}
                  {student.residence_status === "مالک" ? "مالک" :
                    student.residence_status === "مستاجر" ? "مستاجر" : "سایر"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">اطلاعات تحصیلی</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">سال تحصیلی:</span> {student.academic_year}
                </div>
                <div>
                  <span className="font-medium">پایه تحصیلی:</span>{" "}
                  {student.education_level === "10" ? "دهم شبکه‌های کامپیوتری" :
                    student.education_level === "11" ? "یازدهم شبکه‌های کامپیوتری" :
                      student.education_level === "12" ? "دوازدهم شبکه‌های کامپیوتری" : "مشخص نشده"}
                </div>
                <div>
                  <span className="font-medium">آخرین معدل:</span> {student.grade || "مشخص نشده"}
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="font-medium">آدرس مدرسه قبلی:</span> {student.previous_school_address}
                </div>
                <div>
                  <span className="font-medium">وضعیت تحصیلی:</span>{" "}
                  {student.academic_status === "high" ? "عالی" :
                    student.academic_status === "medium" ? "متوسط" :
                      student.academic_status === "low" ? "ضعیف" : "مشخص نشده"}
                </div>
                <div>
                  <span className="font-medium">هدف هنرجو:</span> {student.student_goal}
                </div>
              </CardContent>
            </Card>
          </>
        )
      }
    </div>
  );
};

export default ReadOnlyStudent;