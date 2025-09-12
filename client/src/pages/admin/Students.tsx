import { useState, useRef } from "react";
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
import { Pagination } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useImportStudents } from "@/hooks/useImportStudents";
import { useExportStudents } from "@/hooks/useExportStudents";
import { useFetchStudents } from "@/hooks/useFetchStudents";

const StudentsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useFetchStudents(page, limit, search);
  const importMutation = useImportStudents();
  const exportMutation = useExportStudents();

  const students = data?.students || [];
  const totalPages = data?.totalPages || 1;

  const handleImport = () => {
    if (!file) {
      toast.error("لطفاً فایل اکسل را انتخاب کنید");
      return;
    }
    importMutation.mutate(file, {
      onSuccess: () => {
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-8" dir="rtl">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            مدیریت دانش‌آموزان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm leading-6 transition-all duration-300">
            <p className="font-semibold text-amber-800">راهنمای وارد کردن دانش‌آموزان:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>فایل اکسل باید شامل ستون‌های نام، نام خانوادگی، کد ملی، و سایر اطلاعات الزامی باشد.</li>
              <li>از الگوی ارائه شده توسط سامانه استفاده کنید。</li>
              <li>اطلاعات تکراری (بر اساس کد ملی) وارد نخواهند شد。</li>
            </ul>
          </div>
          <div className="space-y-4">
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
                disabled={isLoading || importMutation.isPending}
              >
                <FaFileImport /> انتخاب فایل
              </Button>
              <Button
                onClick={handleImport}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-all duration-200"
                disabled={!file || isLoading || importMutation.isPending}
              >
                <FaFileImport /> وارد کردن
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-all duration-200"
                disabled={isLoading || exportMutation.isPending}
              >
                <FaFileExport /> خروجی گرفتن
              </Button>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-200">
            <Link to="/admin">بازگشت به داشبورد</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Search and Table */}
      <Card className="border-none shadow-lg">
        <div className="relative flex items-center gap-2 mx-10">
          <Input
            placeholder="جستجو بر اساس نام، کد ملی یا شماره تلفن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
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
                {isLoading ? (
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