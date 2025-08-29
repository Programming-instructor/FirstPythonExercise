import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/axiosConfig';

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

  const fetchClasses = async () => {
    try {
      const response = await api.get(`/class/level/${level}`);
      setClasses(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در دریافت کلاس‌ها');
    }
  };

  const handleDistributeStudents = async () => {
    try {
      const response = await api.post(`/class/distribute-students/${level}`);
      toast.success(response.data.message);
      fetchClasses(); // Refresh classes after distribution
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
    <Card>
      <CardContent>
        <h1 className="text-2xl font-bold mb-4">کلاس‌های پایه {level}</h1>

        <Button asChild variant="outline" className='mb-5 ml-2'>
          <Link to="/admin">بازگشت به داشبورد</Link>
        </Button>
        <Button onClick={handleDistributeStudents} className="mb-4">
          توزیع دانش‌آموزان
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <Card
              key={cls._id}
              className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition"
              onClick={() => navigate(`/admin/class/${level}/${cls.name}`)}
            >
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>دانش‌آموزان: {cls.students.length}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card >
  );
};

export default ClassesByLevel;