import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import { NotebookPen } from "lucide-react";
import { FaChalkboardTeacher, FaRegCalendarAlt } from "react-icons/fa";
import { FaRegFaceSmile } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { PiStudentBold } from "react-icons/pi";

const cards = [
  {
    body: "ثبت نام هنرجوی جدید",
    desc: "مدیریت فناوری اطلاعات",
    icon: <PiStudentBold size={40} />,
    href: "/admin/register-student",
    hasPerm: true,
  },
  {
    body: "ثبت نام اساتید",
    desc: "مدیریت فناوری اطلاعات",
    icon: <FaChalkboardTeacher size={40} />,
    href: "/admin/dashboard",
    hasPerm: false,
  },
  {
    body: "لیست دانش آموزان",
    desc: "ویرایش ، حذف ، بارگزاری تصویر",
    icon: <PiStudentBold size={40} />,
    href: "/admin/students",
    hasPerm: true,
  },
  {
    body: "ارزیابی و عملکرد",
    desc: "بررسی عملکرد هنرجویان",
    icon: <FaRegFaceSmile size={40} />,
    href: "/admin/dashboard",
    hasPerm: true,
  },
  {
    body: "مدیریت کاربران ویژه",
    desc: "تعیین سطح دسترسی",
    icon: <GrUserAdmin size={40} />,
    href: "/admin/dashboard",
    hasPerm: true,
  },
  {
    body: "واحد مشاوره تحصیلی",
    desc: "مشاوره تحصیلی",
    icon: <NotebookPen size={40} />,
    href: "/admin/academic-counseling",
    hasPerm: true,
  },
  {
    body: "معونت آموزشی",
    desc: "پیگیری امور آموزش",
    icon: <FaRegCalendarAlt size={40} />,
    href: "/admin/educational-deputy",
    hasPerm: true,
  },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center gap-8" dir="rtl">
      <h3 className="text-2xl font-bold">اتوماسیون اداری هنرستان</h3>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl w-full auto-rows-fr justify-center ">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            body={card.body}
            desc={card.desc}
            icon={card.icon}
            href={card.href}
            hasPerm={card.hasPerm}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
