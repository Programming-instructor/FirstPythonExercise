import { useFetchUser } from '@/hooks/useFetchUser'; // Adjust path if needed
import DashboardCard from '@/components/admin/dashboard/DashboardCard';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaClipboardList, FaBrain, FaUserTie, FaClipboardCheck, FaUserCog } from 'react-icons/fa';
import { MdPersonAdd, MdClass } from 'react-icons/md';
import { BiBook } from 'react-icons/bi';
import { RiShieldUserLine } from 'react-icons/ri';

const cards = [
  // Management / Admin
  {
    body: 'مدیر',
    desc: 'مدیریت هنرستان',
    icon: <FaUserTie size={40} />,
    href: '/admin/principal',
    permission: 'principal',
  },
  {
    body: 'مدیریت کاربران ویژه',
    desc: 'تعیین سطح دسترسی',
    icon: <FaUserCog size={40} />,
    href: '/admin/users',
    permission: 'manage_users',
  },
  {
    body: 'مدیریت کلاس ها',
    desc: 'تعریف و مدیریت کلاس ها',
    icon: <MdClass size={40} />,
    href: '/admin/class',
    permission: 'manage_classes',
  },

  // Students
  {
    body: 'ثبت نام هنرجوی جدید',
    desc: 'ثبت و اضافه کردن هنرجوی جدید',
    icon: <AiOutlineUserAdd size={40} />,
    href: '/admin/register-student',
    permission: 'register_student',
  },
  {
    body: 'لیست دانش آموزان',
    desc: 'لیست هنرجویان ثبت شده',
    icon: <FaUsers size={40} />,
    href: '/admin/students',
    permission: 'manage_students',
  },

  // Teachers
  {
    body: 'ثبت نام اساتید',
    desc: 'ثبت نام اساتید',
    icon: <MdPersonAdd size={40} />,
    href: '/admin/register-teacher',
    permission: 'register_teachers',
  },
  {
    body: 'لیست اساتید',
    desc: 'لیست اساتید',
    icon: <FaChalkboardTeacher size={40} />,
    href: '/admin/teachers',
    permission: 'register_teachers',
  },

  // Educational / Deputies / Counseling
  {
    body: 'معاونت آموزشی',
    desc: 'پیگیری امور آموزش',
    icon: <FaClipboardList size={40} />,
    href: '/admin/educational-deputy',
    permission: 'educational_deputy',
  },
  {
    body: 'معاونت انضباطی',
    desc: 'معاونت انضباطی',
    icon: <RiShieldUserLine size={40} />,
    href: '/admin/disciplinary-deputy',
    permission: 'disciplinary_deputy',
  },
  {
    body: 'واحد مشاوره تحصیلی',
    desc: 'مشاوره تحصیلی',
    icon: <BiBook size={40} />,
    href: '/admin/academic-counseling',
    permission: 'academic_counseling',
  },
  {
    body: 'مشاور روانکاوی',
    desc: 'مشاوره',
    icon: <FaBrain size={40} />,
    href: '/admin/psych-counselor',
    permission: 'psych_counselor',
  },

  // Evaluation / Reports
  {
    body: 'ارزیابی و عملکرد',
    desc: 'بررسی عملکرد هنرجویان',
    icon: <FaClipboardCheck size={40} />,
    href: '/admin/evaluation',
    permission: 'evaluate_performance',
  },
];

const Dashboard = () => {
  const { data: user, isLoading, error } = useFetchUser();

  // Function to check if user has permission for a card
  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.isAdmin) return true;
    console.log(user.permissions, permission)
    return user.permissions.includes(permission);
  };

  if (isLoading) {
    return <div className="text-center">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">خطا در بارگذاری اطلاعات کاربر</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8" dir="rtl">
      <h3 className="text-xl font-bold">اتوماسیون اداری هنرستان</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl w-full auto-rows-fr justify-center">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            body={card.body}
            desc={card.desc}
            icon={card.icon}
            href={card.href}
            hasPerm={hasPermission(card.permission)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;