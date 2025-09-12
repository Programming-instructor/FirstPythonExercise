import { FaUserAlt } from "react-icons/fa"
import { IoExitOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"


const ProfileCard = ({ name, lastName, logoutUrl }: { name: string, lastName?: string, logoutUrl: string }) => {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav(logoutUrl)
  }
  return (
    <div className="w-full md:max-w-80 min-h-28 shadow-lg rounded-lg flex gap-3 items-center px-4 sm:px-5 bg-slate-100" dir="rtl">
      <FaUserAlt size={48} className="sm:text-6xl text-neutral-600 border-2 border-neutral-600 rounded-full p-1 sm:p-2" />
      <div className="flex flex-col gap-1 text-sm sm:text-base">
        <p>{name} {lastName && lastName}</p>
        <p className="flex items-center gap-1 text-red-600 border-b border-red-500 pb-0 cursor-pointer hover:text-red-700 transition" onClick={handleLogout}>
          <IoExitOutline size={16} className="sm:text-lg" />
          خروج از سیستم
        </p>
      </div>
    </div>
  )
}

export default ProfileCard