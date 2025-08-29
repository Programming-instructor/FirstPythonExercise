import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import api from '@/lib/axiosConfig';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaTrash } from 'react-icons/fa';

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

  const fetchClass = async () => {
    try {
      const response = await api.get(`/class/name/${classname}`);
      setCls(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در دریافت کلاس');
    }
  };

  const fetchUnassignedStudents = async () => {
    try {
      const response = await api.get(`/class/unassigned-students/${level}`);
      setUnassignedStudents(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در دریافت دانش‌آموزان تخصیص‌نشده');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teacher');
      setTeachers(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در دریافت معلمان');
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
      toast.error(error.response?.data?.message || 'خطا در حذف زنگ');
    }
  };

  useEffect(() => {
    fetchClass();
    fetchUnassignedStudents();
    fetchTeachers();
  }, [level, classname]);

  if (!cls) {
    return <div className="container mx-auto p-4">در حال بارگذاری...</div>;
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

  return (
    <Card>
      <CardContent>
        <h1 className="text-2xl font-bold mb-4">کلاس {cls.name} (پایه {cls.level})</h1>
        <Button asChild variant="outline" className='mb-5'>
          <Link to="/admin">بازگشت به داشبورد</Link>
        </Button>

        {/* Students Section */}
        <h2 className="text-xl font-semibold mb-2">دانش‌آموزان</h2>
        <div className="mb-4 flex gap-2">
          <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
            <DialogTrigger asChild>
              <Button>افزودن دانش‌آموز</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>افزودن دانش‌آموزان به {cls.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => setSelectedStudents([...selectedStudents, value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دانش‌آموزان" />
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
                  <p>دانش‌آموزان انتخاب‌شده: {selectedStudents.length}</p>
                  <Button onClick={handleAddStudents} disabled={!selectedStudents.length}>
                    افزودن دانش‌آموزان انتخاب‌شده
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleAutoAddStudents}>افزودن خودکار دانش‌آموزان</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-start'>نام</TableHead>
              <TableHead className='text-start'>نام خانوادگی</TableHead>
              <TableHead className='text-start'>کدملی</TableHead>
              <TableHead className='text-start'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cls.students.map((student) => (
              <TableRow key={student._id} className='group'>
                <TableCell>{student.first_name}</TableCell>
                <TableCell>{student.last_name}</TableCell>
                <TableCell>{student.national_code}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className='group-hover:opacity-100 opacity-0 text-xs hover:bg-red-500 hover:!text-white'
                    onClick={() => handleRemoveStudent(student.national_code)}
                  >
                    <FaTrash />
                    حذف
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Schedule Section */}
        <h2 className="text-xl font-semibold mb-2 mt-6">برنامه</h2>
        <div className="mb-4 flex gap-2">
          <Dialog open={isEditScheduleModalOpen} onOpenChange={setIsEditScheduleModalOpen}>
            <DialogTrigger asChild>
              <Button>ویرایش برنامه</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ویرایش برنامه برای {cls.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSchedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">روز</label>
                  <Select
                    value={scheduleForm.day.toString()}
                    onValueChange={(value: keyof Class['days']) => setScheduleForm({ ...scheduleForm, day: value })}
                  >
                    <SelectTrigger>
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
                  <label className="block text-sm font-medium mb-2">زنگ</label>
                  <Input
                    type="number"
                    value={scheduleForm.period}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, period: e.target.value })}
                    placeholder="مثال: 1"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">درس</label>
                  <Input
                    value={scheduleForm.subject}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                    placeholder="مثال: ریاضی"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">معلم</label>
                  <Select
                    value={scheduleForm.teacherId}
                    onValueChange={(value) => setScheduleForm({ ...scheduleForm, teacherId: value })}
                  >
                    <SelectTrigger>
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
                <Button type="submit">به‌روزرسانی برنامه</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(cls.days).map(([day, periods]) => (
            <Card key={day} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{getDayName(day)}</CardTitle>
              </CardHeader>
              <CardContent>
                {periods.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-start">زنگ</TableHead>
                        <TableHead className="text-start">درس</TableHead>
                        <TableHead className="text-start">معلم</TableHead>
                        <TableHead className="text-start"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {periods.map((period, index) => (
                        <TableRow key={`${day}-${index}`} className="group">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{period.subject}</TableCell>
                          <TableCell>
                            {period.teacher ? `${period.teacher.first_name} ${period.teacher.last_name}` : 'تخصیص‌نشده'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePeriod(day as keyof Class['days'], index)}
                              className='group-hover:opacity-100 opacity-0 text-xs hover:bg-red-500 hover:!text-white'
                            >
                              <FaTrash />
                              حذف
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500">بدون برنامه</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassDetails;