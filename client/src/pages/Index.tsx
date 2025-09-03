import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserTie, FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";

const Index = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">انتخاب نقش</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        <Link to="/admin/auth">
          <Card className="hover:shadow-lg transition-shadow text-right aspect-square flex flex-col justify-center">
            <CardHeader className="flex flex-col items-center">
              <FaUserTie size={40} className="mb-2 text-gray-700" />
              <CardTitle className="text-center">مدیریت</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">ورود به پنل مدیریت برای مدیریت کلاس‌ها و کاربران</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/auth">
          <Card className="hover:shadow-lg transition-shadow text-right aspect-square flex flex-col justify-center">
            <CardHeader className="flex flex-col items-center">
              <FaChalkboardTeacher size={40} className="mb-2 text-gray-700" />
              <CardTitle className="text-center">معلم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">ورود به پنل معلم برای مدیریت دروس و گزارش‌ها</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/auth">
          <Card className="hover:shadow-lg transition-shadow text-right aspect-square flex flex-col justify-center">
            <CardHeader className="flex flex-col items-center">
              <PiStudentBold size={40} className="mb-2 text-gray-700" />
              <CardTitle className="text-center">دانش‌آموز</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">ورود به پنل دانش‌آموز برای مشاهده برنامه و گزارش‌ها</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Index;