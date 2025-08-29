import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/axiosConfig';

interface Class {
  _id: string;
  name: string;
  level: string;
}

const ClassLevels: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [classLevel, setClassLevel] = useState<'10' | '11' | '12'>('10');
  const levels = ['10', '11', '12'];

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/class/add', { name: className, level: classLevel });
      toast.success(response.data.message); // Assuming the backend message is already in Persian
      setIsModalOpen(false);
      setClassName('');
      setClassLevel('10');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در افزودن کلاس');
    }
  };

  return (
    <Card>
      <CardContent>

        <h1 className="text-2xl font-bold mb-4">مدیریت کلاس‌ها</h1>
        <Button asChild variant="outline" className='mb-5 ml-2'>
          <Link to="/admin">بازگشت به داشبورد</Link>
        </Button>

        {/* Add Class Button and Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">افزودن کلاس جدید</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن کلاس جدید</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام کلاس</label>
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="مثال: 11A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">پایه</label>
                <Select value={classLevel} onValueChange={(value: '10' | '11' | '12') => setClassLevel(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب پایه" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">ایجاد کلاس</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Grade Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((level) => (
            <Card
              key={level}
              className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition ease-in-out"
              onClick={() => navigate(`/admin/class/${level}`)}
            >
              <CardHeader>
                <CardTitle>پایه {level}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>مشاهده کلاس‌های پایه {level}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassLevels;