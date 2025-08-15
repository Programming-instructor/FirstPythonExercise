import { FaUserAlt } from "react-icons/fa"
import { IoExitOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"


const ProfileCard = ({ name }: { name: string }) => {
  const nav = useNavigate();

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    nav('/admin/auth')
  }
  return (
    <div className="min-w-80 min-h-28 shadow-lg rounded flex gap-3 items-center px-5" dir="rtl">
      <FaUserAlt size={64} className="text-neutral-600 border-2 border-neutral-600 rounded-full p-1" />
      <div className="flex flex-col gap-1">
        <p>{name}</p>
        <p className="flex items-center gap-1 text-red-600 border-b border-red-500 pb-0 cursor-pointer hover:text-red-700 transition" onClick={handleLogout}>
          <IoExitOutline size={20}/>
          خروج از سیستم
        </p>
      </div>
    </div>
  )
}

export default ProfileCard