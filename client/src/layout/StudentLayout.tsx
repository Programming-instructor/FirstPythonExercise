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
    <div className="min-h-screen w-screen pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-12 lg:px-28 flex flex-col gap-6 sm:gap-9 pb-5" dir="rtl">
      <div className="flex justify-center sm:justify-start">
        <ProfileCard logoutUrl='/' name={student.firstName} lastName={student.lastName} />
      </div>
      <div className="my-6 sm:my-8">
        <Outlet context={student} />
      </div>
    </div>
  );
};

export default StudentLayout;