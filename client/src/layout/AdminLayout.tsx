import { useFetchUser } from '@/hooks/useFetchUser';
import ProfileCard from '@/components/layout/ProfileCard';
import { Outlet, Navigate } from 'react-router-dom';

const AdminLayout = () => {
  const { data: user, error, isLoading } = useFetchUser();

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center text-center" dir="rtl">
        در حال بارگذاری...
      </div>
    );
  }

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen w-screen pt-16 px-28 flex flex-col gap-9" dir="rtl">
      <div className="flex justify-end">
        <ProfileCard name={user.name} />
      </div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;