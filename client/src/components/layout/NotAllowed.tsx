import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const NotAllowed = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow" dir="rtl">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <FaLock className="mx-auto text-red-500" size={48} />
        <h1 className="mt-4 text-xl font-bold text-gray-800">عدم دسترسی</h1>
        <p className="mt-2 text-gray-600">
          شما مجوز لازم برای دسترسی به این صفحه را ندارید.
        </p>
        <p className="mt-2 text-gray-600">
          لطفاً با مدیر سیستم تماس بگیرید یا به داشبورد بازگردید.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/admin"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            بازگشت به داشبورد
          </Link>
          <Link
            to="/logout"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            خروج
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAllowed;