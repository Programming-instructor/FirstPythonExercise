import { useGetAllTeachers } from "@/hooks/useGetAllTeachers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TeacherListRes, FullTeacher } from "@/types/teacher";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDeleteTeacher } from "@/hooks/useDeleteTeacher";
import { useEditTeacher } from "@/hooks/useEditTeacher";
import { useGetTeacherById } from "@/hooks/useGetTeacherById";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TeacherRes = UseQueryResult<TeacherListRes[]>;

const TeachersList = () => {
  const { data, isLoading }: TeacherRes = useGetAllTeachers();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const { mutate: editTeacherMutate } = useEditTeacher();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedTeacher, isLoading: isLoadingTeacher } = useGetTeacherById(selectedId ?? '', !!selectedId);

  // Form states
  const [mobile, setMobile] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [birth_certificate_number, setBirthCertificateNumber] = useState('');
  const [national_code, setNationalCode] = useState('');
  const [academic_year, setAcademicYear] = useState('');
  const [academic_level, setAcademicLevel] = useState<FullTeacher['academic_level'] | ''>('');
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (selectedTeacher) {
      setMobile(selectedTeacher.mobile);
      setFirstName(selectedTeacher.first_name);
      setLastName(selectedTeacher.last_name);
      setBirthDate(selectedTeacher.birth_date);
      setBirthCertificateNumber(selectedTeacher.birth_certificate_number);
      setNationalCode(selectedTeacher.national_code);
      setAcademicYear(selectedTeacher.academic_year);
      setAcademicLevel(selectedTeacher.academic_level);
    }
  }, [selectedTeacher]);

  const handleDelete = (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این معلم را حذف کنید؟')) {
      deleteTeacher(id);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    const data: Partial<FullTeacher> = {
      mobile,
      first_name,
      last_name,
      birth_date,
      birth_certificate_number,
      national_code,
      academic_year,
    };
    if (academic_level !== '') {
      data.academic_level = academic_level;
    }
    editTeacherMutate({ id: selectedId, data, file }, {
      onSuccess: () => setSelectedId(null),
    });
  };

  // Type-safe handler for Select onValueChange
  const handleAcademicLevelChange = (value: string) => {
    setAcademicLevel(value as FullTeacher['academic_level'] | '');
  };

  if (isLoading) return <p className="text-center text-md">در حال بارگذاری...</p>;

  return (
    <div className="flex flex-col items-center" dir="rtl">
      <div className="flex flex-col gap-5 bg-neutral-50 px-8 pt-12 pb-4 shadow rounded-2xl w-full max-w-5xl">
        <h1 className="font-bold text-xl m-auto">لیست اساتید</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right font-bold">نام</TableHead>
              <TableHead className="text-right font-bold">نام خانوادگی</TableHead>
              <TableHead className="text-right font-bold">شماره موبایل</TableHead>
              <TableHead className="text-right font-bold">تعداد گزارش‌ها</TableHead>
              <TableHead className="text-right font-bold">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell className="text-right">{teacher.first_name}</TableCell>
                <TableCell className="text-right">{teacher.last_name}</TableCell>
                <TableCell className="text-right">{teacher.mobile}</TableCell>
                <TableCell className="text-right text-red-700">{teacher.numberOfReports}</TableCell>
                <TableCell className="text-right flex gap-2">
                  <Button variant="outline" className="mr-2" onClick={() => setSelectedId(teacher._id)}>
                    ویرایش
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(teacher._id)}>
                    حذف
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex mt-5">
          <Button asChild variant="outline">
            <Link to="/admin">بازگشت به داشبورد</Link>
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش معلم</DialogTitle>
          </DialogHeader>
          {isLoadingTeacher ? (
            <p>در حال بارگذاری...</p>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[70vh] overflow-auto pl-2">
              <div>
                <Label htmlFor="mobile" className="mb-2">شماره موبایل</Label>
                <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="first_name" className="mb-2">نام</Label>
                <Input id="first_name" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="last_name" className="mb-2">نام خانوادگی</Label>
                <Input id="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="birth_date" className="mb-2">تاریخ تولد</Label>
                <Input id="birth_date" value={birth_date} onChange={(e) => setBirthDate(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="birth_certificate_number" className="mb-2">شماره شناسنامه</Label>
                <Input id="birth_certificate_number" value={birth_certificate_number} onChange={(e) => setBirthCertificateNumber(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="national_code" className="mb-2">کد ملی</Label>
                <Input id="national_code" value={national_code} onChange={(e) => setNationalCode(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="academic_year" className="mb-2">سال تحصیلی</Label>
                <Input id="academic_year" value={academic_year} onChange={(e) => setAcademicYear(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="academic_level" className="mb-2">سطح تحصیلی</Label>
                <Select value={academic_level} onValueChange={handleAcademicLevelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school_diploma">دیپلم دبیرستان</SelectItem>
                    <SelectItem value="teaching_diploma">دیپلم تدریس</SelectItem>
                    <SelectItem value="associate_degree">کاردانی</SelectItem>
                    <SelectItem value="bachelor_degree">کارشناسی</SelectItem>
                    <SelectItem value="master_degree">کارشناسی ارشد</SelectItem>
                    <SelectItem value="doctoral_degree">دکتری</SelectItem>
                    <SelectItem value="postdoctoral">پسادکتری</SelectItem>
                    <SelectItem value="other_certification">گواهینامه دیگر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teacher_portrait_front" className="mb-2">عکس پرتره</Label>
                <Input id="teacher_portrait_front" type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                {selectedTeacher?.teacher_portrait_front?.url && (
                  <p>عکس فعلی: {selectedTeacher.teacher_portrait_front.url}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">ذخیره تغییرات</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersList;