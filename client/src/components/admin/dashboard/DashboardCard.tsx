import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { MdDoNotDisturb } from "react-icons/md";
import { Link } from "react-router-dom";

interface props {
  icon: ReactNode;
  body: string;
  desc: string;
  href: string;
  hasPerm: boolean;
}

const DashboardCard = ({ icon, body, desc, href, hasPerm }: props) => {
  return (
    <Link to={hasPerm ? href : '/admin/dashboard'} className="h-full">
      <Card className={cn("group bg-slate-50 flex flex-col h-full items-center gap-3 p-3 cursor-pointer text-neutral-600 hover:-translate-y-1 hover:shadow-xl hover:border transition relative", hasPerm ? "hover:text-neutral-900 " : "hover:shadow-neutral-300 cursor-not-allowed hover:bg-red-50 hover:text-red-200")}>
        {
          !hasPerm && (
            <div className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 transition">
              <MdDoNotDisturb size={64} className="text-red-900" />
            </div>
          )
        }
        <CardHeader className="p-0 flex items-center justify-center">
          <span>
            {icon}
          </span>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-1.5">
          <p className="text-sm font-semibold text-center">{body}</p>
          <p className="text-xs font-light text-center">{desc}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DashboardCard