import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/axiosConfig';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaTrash } from 'react-icons/fa';
import { PlusCircle, Edit, UserPlus, Calendar, Trash2 } from 'lucide-react'; // Icons for better UX
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Breadcrumb from '@/components/admin/global/Breadcrumb';
import { useDeleteClass } from '@/hooks/useDeleteClass';

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  national_code: string;
}

interface Teacher {
  _id: string;
  first_name: string;
  last_name: string;
  mobile: string;
}

interface Period {
  subject: string;
  teacher: Teacher;
}

interface Class {
  _id: string;
  name: string;
  level: string;
  students: Student[];
  days: {
    [key: string]: Period[];
  };
}

const ClassDetails: React.FC = () => {
  const { level, classname } = useParams<{ level: string; classname: string }>();
  const navigate = useNavigate();
  const [cls, setCls] = useState<Class | null>(null);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [scheduleForm, setScheduleForm] = useState({
    day: 'saturday' as keyof Class['days'],
    period: '1',
    subject: '',
    teacherId: '',
  });

  const { mutate: deleteClassMutation, isPending: isDeleting } = useDeleteClass();

  const fetchClass = async () => {
    try {
      const response = await api.get(`/class/name/${classname}`);
      setCls(response.data);
    } catch (error: any) {
      toast.error('خطا در دریافت کلاس');
    }
  };

  const fetchUnassignedStudents = async () => {
    try {
      const response = await api.get(`/class/unassigned-students/${level}`);
      setUnassignedStudents(response.data);
    } catch (error: any) {
      toast.error('خطا در دریافت دانش‌آموزان تخصیص‌نشده');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teacher');
      setTeachers(response.data);
    } catch (error: any) {
      toast.error('خطا در دریافت معلمان');
    }
  };

  const handleAddStudents = async () => {
    try {
      const response = await api.post('/class/add-students', {
        classId: cls?._id,
        nationalCodes: selectedStudents,
      });
      toast.success(response.data.message);
      setIsAddStudentModalOpen(false);
      setSelectedStudents([]);
      fetchClass();
      fetchUnassignedStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در افزودن دانش‌آموزان');
    }
  };

  const handleRemoveStudent = async (nationalCode: string) => {
    try {
      const response = await api.post('/class/remove-students', {
        classId: cls?._id,
        nationalCodes: [nationalCode],
      });
      toast.success(response.data.message);
      fetchClass();
      fetchUnassignedStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در حذف دانش‌آموز');
    }
  };

  const handleAutoAddStudents = async () => {
    try {
      const response = await api.post(`/class/auto-add-students/${cls?._id}`);
      toast.success(response.data.message);
      fetchClass();
      fetchUnassignedStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در افزودن خودکار دانش‌آموزان');
    }
  };

  const handleEditSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/class/assign-teacher', {
        classId: cls?._id,
        day: scheduleForm.day,
        subject: scheduleForm.subject,
        teacherId: scheduleForm.teacherId,
        period: parseInt(scheduleForm.period) - 1,
      });
      toast.success(response.data.message);
      setIsEditScheduleModalOpen(false);
      setScheduleForm({ day: 'saturday', period: '1', subject: '', teacherId: '' });
      fetchClass();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی برنامه');
    }
  };

  const handleRemovePeriod = async (day: keyof Class['days'], periodIndex: number) => {
    try {
      const response = await api.post('/class/remove-period', {
        classId: cls?._id,
        day,
        period: periodIndex + 1,
      });
      toast.success(response.data.message);
      fetchClass();
    } catch (error: any) {
      toast.error('خطا در حذف زنگ');
    }
  };

  const handleDeleteClass = () => {
    if (cls?._id) {
      deleteClassMutation(cls._id, {
        onSuccess: () => {
          navigate(`/admin/class/${level}`);
        },
      });
    }
  };

  useEffect(() => {
    fetchClass();
    fetchUnassignedStudents();
    fetchTeachers();
  }, [level, classname]);

  if (!cls) {
    return <div className="container mx-auto p-6">در حال بارگذاری...</div>;
  }

  const getDayName = (day: string) => {
    switch (day) {
      case 'saturday': return 'شنبه';
      case 'sunday': return 'یک‌شنبه';
      case 'monday': return 'دوشنبه';
      case 'tuesday': return 'سه‌شنبه';
      case 'wednesday': return 'چهارشنبه';
      case 'thursday': return 'پنج‌شنبه';
      case 'friday': return 'جمعه';
      default: return 'روز نامعتبر';
    }
  };

  const removeFromSelected = (code: string) => {
    setSelectedStudents(selectedStudents.filter((c) => c !== code));
  };

  return (
    <div className="container">
      <Breadcrumb
        items={[
          { link: '/admin', text: 'داشبورد' },
          { link: '/admin/class', text: 'مدیریت کلاس‌ها' },
          { link: `/admin/class/${level}`, text: `پایه ${level}` },
          { text: cls.name },
        ]}
      />
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">کلاس {cls.name} (پایه {cls.level})</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting} className="text-white">
                  <Trash2 className="ml-2 h-5 w-5" />
                  حذف کلاس
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    این عملیات قابل بازگشت نیست. کلاس {cls.name} و تمام اطلاعات مرتبط حذف خواهد شد.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>لغو</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClass} className="bg-red-600 hover:bg-red-700">
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Button asChild variant="outline" className="mb-6 border-gray-300 hover:bg-gray-100">
            <Link to="/admin">بازگشت به داشبورد</Link>
          </Button>
          {/* Students Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">دانش‌آموزان</h2>
              <div className="flex gap-3">
                <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <PlusCircle className="ml-2 h-5 w-5" />
                      افزودن دانش‌آموز
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-lg">افزودن دانش‌آموزان به {cls.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <p className="text-sm text-gray-600">
                        تعداد دانش‌آموزان باقی مانده: {unassignedStudents.length}
                      </p>
                      <Select
                        onValueChange={(value) => {
                          if (!selectedStudents.includes(value)) {
                            setSelectedStudents([...selectedStudents, value]);
                          }
                        }}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="انتخاب دانش‌آموز" />
                        </SelectTrigger>
                        <SelectContent>
                          {unassignedStudents.map((student) => (
                            <SelectItem key={student._id} value={student.national_code}>
                              {student.first_name} {student.last_name} ({student.national_code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div>
                        <h3 className="text-sm font-medium mb-2">دانش‌آموزان انتخاب‌شده:</h3>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedStudents.map((code) => {
                            const student = unassignedStudents.find((s) => s.national_code === code);
                            return (
                              <li key={code} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                {student ? `${student.first_name} ${student.last_name}` : code}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromSelected(code)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                        <Button
                          onClick={handleAddStudents}
                          disabled={!selectedStudents.length}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                          افزودن دانش‌آموزان انتخاب‌شده
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={handleAutoAddStudents} className="bg-green-600 hover:bg-green-700 text-white">
                  <UserPlus className="ml-2 h-5 w-5" />
                  افزودن خودکار
                </Button>
              </div>
            </div>

            <Badge variant="secondary" className="text-lg my-3.5">
              تعداد: {cls.students.length}
            </Badge>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-start py-4">ردیف</TableHead>
                    <TableHead className="text-start py-4">نام</TableHead>
                    <TableHead className="text-start py-4">نام خانوادگی</TableHead>
                    <TableHead className="text-start py-4">کدملی</TableHead>
                    <TableHead className="text-start py-4">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cls.students.map((student, index) => (
                    <TableRow key={student._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-4">
                        <span className='bg-cyan-50 p-1 rounded-2xl'>
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">{student.first_name}</TableCell>
                      <TableCell className="py-4">{student.last_name}</TableCell>
                      <TableCell className="py-4">{student.national_code}</TableCell>
                      <TableCell className="py-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                              <FaTrash className="ml-2 h-4 w-4" />
                              حذف
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>آیا از حذف {student.first_name} {student.last_name} از این کلاس مطمئن هستید؟</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>لغو</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveStudent(student.national_code)} className="bg-red-600 hover:bg-red-700">
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
          {/* Schedule Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">برنامه</h2>
              <Dialog open={isEditScheduleModalOpen} onOpenChange={setIsEditScheduleModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Edit className="ml-2 h-5 w-5" />
                    ویرایش برنامه
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg">ویرایش برنامه برای {cls.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditSchedule} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">روز</label>
                      <Select
                        value={scheduleForm.day as string}
                        onValueChange={(value: keyof Class['days']) => setScheduleForm({ ...scheduleForm, day: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="انتخاب روز" />
                        </SelectTrigger>
                        <SelectContent>
                          {['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                            <SelectItem key={day} value={day}>
                              {getDayName(day)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">درس</label>
                      <Input
                        value={scheduleForm.subject}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                        placeholder="مثال: ریاضی"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">معلم</label>
                      <Select
                        value={scheduleForm.teacherId}
                        onValueChange={(value) => setScheduleForm({ ...scheduleForm, teacherId: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="انتخاب معلم" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher._id} value={teacher._id}>
                              {teacher.first_name} {teacher.last_name} ({teacher.mobile})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                      به‌روزرسانی برنامه
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(cls.days).map(([day, periods]) => (
                <Card key={day} className="shadow-md border border-gray-200 rounded-xl overflow-hidden">
                  <CardHeader className="px-5 flex items-center">
                    <Calendar className="ml-2 h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-md font-semibold text-gray-800">{getDayName(day)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    {periods.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-start py-3">زنگ</TableHead>
                            <TableHead className="text-start py-3">درس</TableHead>
                            <TableHead className="text-start py-3">معلم</TableHead>
                            <TableHead className="text-start py-3">عملیات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {periods.map((period, index) => (
                            <TableRow key={`${day}-${index}`} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3">
                                <span className='bg-cyan-50 p-1 rounded-2xl'>
                                  {index + 1}
                                </span>
                              </TableCell>
                              <TableCell className="py-3">{period.subject}</TableCell>
                              <TableCell className="py-3">
                                {period.teacher ? `${period.teacher.first_name} ${period.teacher.last_name}` : 'باقی مانده'}
                              </TableCell>
                              <TableCell className="py-3">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                      <FaTrash className="ml-2 h-4 w-4" />
                                      حذف
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="rounded-xl">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        این عملیات قابل بازگشت نیست. زنگ {index + 1} در روز {getDayName(day)} حذف خواهد شد.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>لغو</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleRemovePeriod(day as keyof Class['days'], index)} className="bg-red-600 hover:bg-red-700">
                                        حذف
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-gray-500 py-4">بدون برنامه</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassDetails;