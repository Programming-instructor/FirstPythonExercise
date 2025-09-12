import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

const DisciplinaryDeputy = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-4" dir="rtl">
      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8 space-y-8">
        <h1 className="font-bold text-xl text-center">معاونت انضباطی</h1>

        <div className="grid grid-cols-2 gap-4">
          <Link to={'/admin/disciplinary-deputy/class-reports'}>
            <Card className="hover:shadow-xl transition">
              <CardContent>
                <p className="font-bold text-lg text-center">
                  گزارش کلاس ها
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={'/admin/disciplinary-deputy/students'}>
            <Card className="hover:shadow-xl transition">
              <CardContent>
                <p className="font-bold text-lg text-center">
                  دانش آموزان
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div >
  )
}

export default DisciplinaryDeputy