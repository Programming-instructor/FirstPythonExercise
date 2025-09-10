import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/axiosConfig';
import { PlusCircle, Users } from 'lucide-react'; // Icons for better UX
import Breadcrumb from '@/components/admin/global/BreadCrumb';

interface Class {
  _id: string;
  name: string;
  level: string;
  students: { first_name: string; last_name: string; national_code: string }[];
}

const ClassesByLevel: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState('');

  const fetchClasses = async () => {
    try {
      const response = await api.get(`/class/level/${level}`);
      setClasses(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در دریافت کلاس‌ها');
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/class/add', { name: className, level });
      toast.success(response.data.message);
      setIsModalOpen(false);
      setClassName('');
      fetchClasses(); // Refresh after add
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در افزودن کلاس');
    }
  };

  const handleDistributeStudents = async () => {
    try {
      const response = await api.post(`/class/distribute-students/${level}`);
      toast.success(response.data.message);
      fetchClasses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در توزیع دانش‌آموزان');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [level]);

  if (!['10', '11', '12'].includes(level || '')) {
    return <div className="container mx-auto p-4">پایه نامعتبر</div>;
  }

  return (
    <div className="container">
      <Breadcrumb
        items={[
          { link: '/admin', text: 'داشبورد' },
          { link: '/admin/class', text: 'مدیریت کلاس‌ها' },
          { text: `پایه ${level}` },
        ]}
      />
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">کلاس‌های پایه {level}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button asChild variant="outline" className="border-gray-300 hover:bg-gray-100">
              <Link to="/admin">بازگشت به داشبورد</Link>
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusCircle className="ml-2 h-5 w-5" />
                  افزودن کلاس جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">افزودن کلاس جدید به پایه {level}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddClass} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">نام کلاس</label>
                    <Input
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="مثال: 11A"
                      required
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    ایجاد کلاس
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button onClick={handleDistributeStudents} className="bg-green-600 hover:bg-green-700 text-white">
              <Users className="ml-2 h-5 w-5" />
              توزیع دانش‌آموزان
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card
                key={cls._id}
                className="cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out bg-white border border-gray-200 rounded-xl overflow-hidden"
                onClick={() => navigate(`/admin/class/${level}/${cls.name}`)}
              >
                <CardHeader className="">
                  <CardTitle className="text-xl font-semibold text-gray-800">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600">دانش‌آموزان: {cls.students.length}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassesByLevel;