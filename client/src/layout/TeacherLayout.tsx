import ProfileCard from '@/components/layout/ProfileCard';
import { Outlet, Navigate } from 'react-router-dom';
import { useFetchTeacher } from '@/hooks/useFetchTeacher';

const TeacherLayout = () => {
  const { data: teacher, error, isLoading } = useFetchTeacher();

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center text-center" dir="rtl">
        در حال بارگذاری...
      </div>
    );
  }


  if (error || !teacher) {
    return <Navigate to="/teacher/auth" replace />;
  }

  return (
    <div className="min-h-screen w-screen lg:pt-16 lg:px-28 flex flex-col gap-9 pb-5" dir="rtl">
      <div className="flex">
        <ProfileCard logoutUrl='/' name={teacher.firstName} lastName={teacher.lastName} />
      </div>
      <Outlet context={teacher} />
    </div>
  );
};

export default TeacherLayout;