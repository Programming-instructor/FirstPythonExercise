import { useEffect, useState, useRef } from "react";
import { FaFileImport, FaFileExport, FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axiosConfig";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import type { Student } from "@/types/student";
import { Loader2 } from "lucide-react";

interface StudentResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data: StudentResponse = await api.get(
        `/student?page=${page}&limit=${limit}&search=${search}`
      );
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      toast.error(err.message || "خطا در دریافت لیست دانش‌آموزان");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("لطفاً فایل اکسل را انتخاب کنید");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/student/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("دانش‌آموزان با موفقیت وارد شدند");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      fetchStudents();
    } catch (err: any) {
      toast.error(err.message || "خطا در وارد کردن دانش‌آموزان");
    }
  };

  const handleExport = async () => {
    try {
      const res: Blob = await api.get("/student/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(res);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err.message || "خطا در خروجی گرفتن دانش‌آموزان");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      handleImport(); // Automatically import when a file is selected
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  return (
    <div className="container mx-auto p-6 space-y-8" dir="rtl">
      {/* Header */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            مدیریت دانش‌آموزان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm leading-6 transition-all duration-300">
            <p className="font-semibold text-amber-800">راهنمای وارد کردن دانش‌آموزان:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>فایل اکسل باید شامل ستون‌های نام، نام خانوادگی، کد ملی، و سایر اطلاعات الزامی باشد.</li>
              <li>از الگوی ارائه شده توسط سامانه استفاده کنید.</li>
              <li>اطلاعات تکراری (بر اساس کد ملی) وارد نخواهند شد.</li>
            </ul>
          </div>

          {/* Controls (Search and Import/Export) */}
          <div className="space-y-4">

            {/* Import / Export Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                aria-label="انتخاب فایل اکسل برای وارد کردن"
              />
              <Button
                onClick={triggerFileInput}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-200"
              >
                <FaFileImport /> وارد کردن
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-all duration-200"
              >
                <FaFileExport /> خروجی گرفتن
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-lg">
        {/* Search */}
        <div className="relative flex items-center gap-2 mx-10">
          <Input
            placeholder="جستجو بر اساس نام، کد ملی یا شماره تلفن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <FaSearch className="absolute right-3 text-gray-400" />
        </div>
        <CardContent>
          <div className="overflow-x-auto overflow-y-visible rounded-lg">
            <Table>
              <TableCaption className="text-gray-600">لیست دانش‌آموزان</TableCaption>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700 text-start">نام</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-start">نام خانوادگی</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-start">کد ملی</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-start">شماره دانش‌آموز</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-start">شماره پدر</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-start">شماره مادر</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-start">سال تحصیلی</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-start">مقطع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex justify-center items-center gap-2 text-gray-500">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>در حال بارگذاری...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <TableRow
                      key={student._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="text-gray-800">{student.first_name}</TableCell>
                      <TableCell className="text-gray-800">{student.last_name}</TableCell>
                      <TableCell className="text-gray-800">{student.national_code}</TableCell>
                      <TableCell className="text-gray-800">{student.student_phone}</TableCell>
                      <TableCell className="text-gray-800">{student.father_phone}</TableCell>
                      <TableCell className="text-gray-800">{student.mother_phone}</TableCell>
                      <TableCell className="text-gray-800">{student.academic_year}</TableCell>
                      <TableCell className="text-gray-800">{student.education_level}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      هیچ دانش‌آموزی یافت نشد
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default StudentsPage;