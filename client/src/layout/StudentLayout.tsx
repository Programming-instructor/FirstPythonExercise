import ProfileCard from '@/components/layout/ProfileCard';
import { useFetchStudent } from '@/hooks/useFetchStudent';
import { Outlet, Navigate } from 'react-router-dom';

const StudentLayout = () => {
  const { data: student, error, isLoading } = useFetchStudent();

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center text-center" dir="rtl">
        در حال بارگذاری...
      </div>
    );
  }


  if (error || !student) {
    return <Navigate to="/student/auth" replace />;
  }

  return (
    <div className="min-h-screen w-screen lg:pt-16 lg:px-28 flex flex-col gap-9 pb-5" dir="rtl">
      <div className="flex">
        <ProfileCard logoutUrl='/' name={student.firstName} lastName={student.lastName} />
      </div>
      <div className="my-8">
        <Outlet context={student} />
      </div>
    </div>
  );
};

export default StudentLayout;