import Breadcrumb from "@/components/admin/global/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

const Principal = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-4" dir="rtl">
      <div className="w-full max-w-5xl mx-auto">
        <Breadcrumb
          items={[
            { link: '/admin', text: 'داشبورد' },
            { text: 'مدیریت' },
          ]}
        />
      </div>

      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8 space-y-8">
        <h1 className="font-bold text-2xl text-center">مدیریت</h1>

        <div className="grid grid-cols-3 gap-4">
          <Link to="reports">
            <Card className="hover:shadow-xl transition">
              <CardContent>
                <p className="font-bold text-xl text-center">
                  گزارش کلاس ها
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="students">
            <Card className="hover:shadow-xl transition">
              <CardContent>
                <p className="font-bold text-xl text-center">
                  دانش آموزان
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="student-reports">
            <Card className="hover:shadow-xl transition">
              <CardContent>
                <p className="font-bold text-xl text-center">
                  گزارش دانش آموزان
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div >
  )
}

export default Principal