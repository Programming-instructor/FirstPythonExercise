import { useState } from 'react'
import { useGetAttendanceByDate } from '@/hooks/useGetAttendanceByDate'
import { useGetMissingAttendanceByDate } from '@/hooks/useGetMissingAttendanceByDate'
import { useAddReportToTeacher } from '@/hooks/useAddReportToTeacher'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner' // Import Sonner components
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import type { Value } from 'react-multi-date-picker'
import moment from 'moment-jalaali'
import { Link } from 'react-router-dom'

// force moment-jalaali to use EN digits internally
moment.loadPersian({ usePersianDigits: false })

interface TeacherReport {
  _id: string
  message: string
  date: string
}

interface Teacher {
  teacher_portrait_front: {
    url: string
    public_id: string
  }
  _id: string
  mobile: string
  first_name: string
  last_name: string
  birth_date: string
  birth_certificate_number: string
  national_code: string
  academic_year: string
  academic_level: string
  createdAt: string
  updatedAt: string
  __v: number
  otp: string | null
  otpExpires: string | null
  reports: TeacherReport[]
  numberOfReports: number
}

interface Guardian {
  name: string
  relation: string
  mourir: string
}

interface Student {
  guardian: Guardian
  student_portrait_front: {
    url: string
    public_id: string
  }
  _id: string
  first_name: string
  last_name: string
  father_name: string
  mother_name: string
  national_code: string
  birth_date: string
  birth_certificate_number: string
  student_phone: string
  father_phone: string
  father_job: string
  mother_phone: string
  academic_year: string
  education_level: string
  mother_job: string
  grade: number
  emergency_phone: string
  marital_status: string
  previous_school_address: string
  home_address: string
  residence_status: string
  postal_code: string
  home_phone: string
  student_goal: string
  academic_status: string
  __v: number
  accepted: boolean
  class: string
}

interface StudentAttendance {
  student: Student
  status: 'absent' | 'present'
  _id: string
}

interface Attendance {
  date: string
  day: string
  period: number
  subject: string
  teacher: Teacher
  studentsAttendance: StudentAttendance[]
  report: string
  _id: string
}

interface ClassAttendance {
  className: string
  attendance: Attendance[]
}

interface MissingAttendance {
  classId: string
  className: string
  date: string
  day: string
  period: number
  subject: string
  teacherId: string
  teacherName: string
  teacherMobile: string
}

type AttendanceQueryResult = UseQueryResult<ClassAttendance[]>
type MissingAttendanceQueryResult = UseQueryResult<MissingAttendance[]>
type AddReportMutationResult = UseMutationResult<any, unknown, { teacherId: string; date: string; message: string }, unknown>

const DisciplinaryDeputyReports = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { data }: AttendanceQueryResult = useGetAttendanceByDate(selectedDate || '')
  const { data: missingAttendances }: MissingAttendanceQueryResult = useGetMissingAttendanceByDate(selectedDate || '')

  const addReportMutation: AddReportMutationResult = useAddReportToTeacher()

  const handleSetToday = () => {
    const today = moment() // today in Gregorian
    const jalaliDateStr = today.format('jYYYY-jMM-jDD') // EN digits
    setSelectedDate(jalaliDateStr)
  }

  const handleDateChange = (value: Value) => {
    if (value instanceof DateObject) {
      const gregDate = value.toDate() // plain JS Date
      const m = moment(gregDate)
      const jalaliDateStr = m.format('jYYYY-jMM-jDD') // EN digits
      setSelectedDate(jalaliDateStr)
    } else {
      setSelectedDate(null)
    }
  }

  // for display in Persian numerals
  const displayDate = selectedDate
    ? moment(selectedDate, 'jYYYY-jMM-jDD').locale('fa').format('jYYYY/jMM/jDD')
    : ''

  const dayMap: Record<string, string> = {
    sunday: 'یکشنبه',
    monday: 'دوشنبه',
    tuesday: 'سه‌شنبه',
    wednesday: 'چهارشنبه',
    thursday: 'پنجشنبه',
    friday: 'جمعه',
    saturday: 'شنبه',
  }

  const statusMap: Record<string, string> = {
    absent: 'غایب',
    present: 'حاضر',
  }

  const handleSubmitWarning = (miss: MissingAttendance) => {
    const message = `عدم ثبت حضور و غیاب برای کلاس ${miss.className}، زنگ ${miss.period} (${miss.subject}) در تاریخ ${displayDate}`
    addReportMutation.mutate(
      {
        teacherId: miss.teacherId,
        date: selectedDate!,
        message,
      },
      {
        onSuccess: () => {
          toast.success('اخطار با موفقیت ارسال شد', {
            description: `اخطار برای ${miss.teacherName} ثبت شد.`,
          })
        },
        onError: (error) => {
          toast.error('خطا در ارسال اخطار', {
            description: 'لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
          })
          console.error('Error submitting warning:', error)
        },
      }
    )
  }

  return (
    <Card dir="rtl" className="container mx-auto p-4">
      <CardContent>
        <h1 className="text-2xl font-bold mb-4 text-center">معاون انضباطی - حضور و غیاب</h1>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="date-picker" className="mb-2 block">
              انتخاب تاریخ
            </Label>
            <DatePicker
              id="date-picker"
              calendar={persian}
              locale={persian_fa}
              value={selectedDate || null}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              containerStyle={{ width: '100%' }}
              inputClass="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              calendarPosition="bottom-right"
              placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۱)"
            />
          </div>
          <Button onClick={handleSetToday} className="w-full sm:w-auto">
            تنظیم به امروز
          </Button>
        </div>

        {!selectedDate && (
          <div className="text-center text-muted-foreground">لطفاً یک تاریخ انتخاب کنید</div>
        )}

        {selectedDate && !data && (
          <div className="text-center">در حال بارگذاری...</div>
        )}

        {selectedDate && data && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              حضور و غیاب تاریخ {displayDate}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {data.map((classItem: ClassAttendance, index: number) => (
                <AccordionItem value={`class-${index}`} key={index}>
                  <AccordionTrigger className="text-right hover:bg-neutral-100 hover:no-underline bg-neutral-50 items-center px-4 cursor-pointer">
                    {classItem.className}
                  </AccordionTrigger>
                  <AccordionContent className="shadow px-4 mt-1">
                    {classItem.attendance.map((att: Attendance, attIndex: number) => (
                      <div key={attIndex} className="mb-6 border-b pb-4">
                        <h3 className="text-xl font-semibold mb-2">زنگ {att.period}: {att.subject}</h3>
                        <p className="mb-2">روز: {dayMap[att.day.toLowerCase()] || att.day}</p>
                        <p className="mb-2">معلم: {att.teacher.first_name} {att.teacher.last_name}</p>
                        <p className="mb-2">گزارش معلم: {att.report || 'بدون گزارش'}</p>
                        <h4 className="font-bold mt-4">حضور و غیاب دانش‌آموزان:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-start">نام</TableHead>
                              <TableHead className="text-start">نام خانوادگی</TableHead>
                              <TableHead className="text-start">وضعیت</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {att.studentsAttendance.map((stuAtt: StudentAttendance, stuIndex: number) => (
                              <TableRow key={stuIndex}>
                                <TableCell>{stuAtt.student.first_name}</TableCell>
                                <TableCell>{stuAtt.student.last_name}</TableCell>
                                <TableCell
                                  className={stuAtt.status === 'absent' ? 'text-red-600' : 'text-green-600'}
                                >
                                  {statusMap[stuAtt.status] || stuAtt.status}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}

        {selectedDate && missingAttendances && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              عدم ثبت حضور و غیاب تاریخ {displayDate}
            </h2>
            {missingAttendances.length === 0 ? (
              <div className="text-center text-muted-foreground">همه حضور و غیاب‌ها ثبت شده است</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">کلاس</TableHead>
                    <TableHead className="text-start">روز</TableHead>
                    <TableHead className="text-start">زنگ</TableHead>
                    <TableHead className="text-start">درس</TableHead>
                    <TableHead className="text-start">معلم</TableHead>
                    <TableHead className="text-start">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missingAttendances.map((miss: MissingAttendance, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{miss.className}</TableCell>
                      <TableCell>{dayMap[miss.day.toLowerCase()] || miss.day}</TableCell>
                      <TableCell>{miss.period}</TableCell>
                      <TableCell>{miss.subject}</TableCell>
                      <TableCell>{miss.teacherName}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleSubmitWarning(miss)}
                          disabled={addReportMutation.isPending}
                          variant="destructive"
                        >
                          ارسال اخطار
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        <Button asChild variant="outline" className='mt-5'>
          <Link to="/admin">بازگشت به داشبورد</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default DisciplinaryDeputyReports