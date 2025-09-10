import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School } from 'lucide-react'; // Add icon for better UX
import Breadcrumb from '@/components/admin/global/BreadCrumb';

const ClassLevels: React.FC = () => {
  const navigate = useNavigate();
  const levels = ['10', '11', '12'];

  return (
    <div className="container">
      <Breadcrumb
        items={[
          { link: '/admin', text: 'داشبورد' },
          { text: 'مدیریت کلاس‌ها' },
        ]}
      />
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">مدیریت کلاس‌ها</h1>
          <Button asChild variant="outline" className="mb-6 border-gray-300 hover:bg-gray-100">
            <Link to="/admin">بازگشت به داشبورد</Link>
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((level) => (
              <Card
                key={level}
                className="cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 pt-0 ease-in-out bg-white border border-gray-200 rounded-xl overflow-hidden"
                onClick={() => navigate(`/admin/class/${level}`)}
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                  <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                    <School className="ml-2 h-6 w-6 text-blue-600" />
                    پایه {level}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600">مشاهده کلاس‌های پایه {level}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassLevels;