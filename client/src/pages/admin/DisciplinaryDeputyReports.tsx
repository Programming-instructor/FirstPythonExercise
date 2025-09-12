import { useState, useEffect } from 'react'
import { useGetAttendanceByDate } from '@/hooks/useGetAttendanceByDate'
import { useGetMissingAttendanceByDate } from '@/hooks/useGetMissingAttendanceByDate'
import { useAddReportToTeacher } from '@/hooks/useAddReportToTeacher'
import { useUpdateAttendanceByDeputy } from '@/hooks/useUpdateAttendanceByDeputy'
import { useConfirmByDisciplinaryDeputy } from '@/hooks/useConfirmByDisciplinaryDeputy'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { CalendarIcon, CheckCircle2, Edit2, XCircle, AlertTriangle, Save } from 'lucide-react'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import type { Value } from 'react-multi-date-picker'
import moment from 'moment-jalaali'
import { Link } from 'react-router-dom'
import type { Student } from '@/types/student'

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

interface StudentAttendance {
  student: Student
  status: 'absent' | 'present' | 'late'
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
  confirmedBy: {
    disciplinaryDeputy: boolean
    principal: boolean
  }
}

interface ClassAttendance {
  className: string
  attendance: Attendance[]
}

interface MissingAttendance {
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
  const [editingStates, setEditingStates] = useState<Record<string, { report: string; attendances: StudentAttendance[] }>>({})

  const { data, isLoading: isAttendanceLoading, refetch: refetchAttendance }: AttendanceQueryResult = useGetAttendanceByDate(selectedDate || '')
  const { data: missingAttendances, isLoading: isMissingLoading, refetch: refetchMissingAttendance }: MissingAttendanceQueryResult = useGetMissingAttendanceByDate(selectedDate || '')

  const addReportMutation: AddReportMutationResult = useAddReportToTeacher()
  const updateAttendanceMutation = useUpdateAttendanceByDeputy()
  const confirmMutation = useConfirmByDisciplinaryDeputy()

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
    late: 'تاخیر',
  }

  const statusColors: Record<string, string> = {
    absent: 'text-red-600',
    present: 'text-green-600',
    late: 'text-yellow-600',
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

  const initializeEditingState = (att: Attendance, className: string) => {
    const key = `${className}-${att.period}`
    console.log(className)
    if (!editingStates[key]) {
      setEditingStates(prev => ({
        ...prev,
        [key]: {
          report: att.report,
          attendances: [...att.studentsAttendance],
        }
      }))
    }
  }

  const handleReportChange = (value: string, className: string, period: number) => {
    const key = `${className}-${period}`
    setEditingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        report: value,
      }
    }))
  }

  const handleStatusChange = (studentId: string, newStatus: 'present' | 'absent' | 'late', className: string, period: number) => {
    const key = `${className}-${period}`
    setEditingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        attendances: prev[key].attendances.map(sa =>
          sa.student._id === studentId ? { ...sa, status: newStatus } : sa
        )
      }
    }))
  }

  const handleSaveChanges = (att: Attendance, className: string) => {
    const key = `${className}-${att.period}`
    const editingData = editingStates[key]
    if (!editingData) return

    updateAttendanceMutation.mutate({
      className,
      date: att.date,
      day: att.day,
      period: att.period,
      attendances: editingData.attendances.map(sa => ({
        studentId: sa.student._id,
        status: sa.status
      })),
      report: editingData.report
    }, {
      onSuccess: () => {
        toast.success('تغییرات با موفقیت ذخیره شد')
      },
      onError: () => {
        toast.error('خطا در ذخیره تغییرات')
      }
    })
  }

  const handleConfirm = (att: Attendance, className: string) => {
    confirmMutation.mutate({
      className,
      date: att.date,
      day: att.day,
      period: att.period
    }, {
      onSuccess: () => {
        toast.success('تایید با موفقیت انجام شد');
        refetchAttendance();
        refetchMissingAttendance();
      },
      onError: () => {
        toast.error('خطا در تایید')
      }
    })
  }

  useEffect(() => {
    if (data) {
      let count = 0
      data.forEach(classItem => {
        classItem.attendance.forEach(att => {
          if (!att.confirmedBy?.disciplinaryDeputy) count++
          initializeEditingState(att, classItem.className)
        })
      })
      if (count > 0) {
        toast.info(`تعداد حضور و غیاب جدید/تایید نشده: ${count}`, {
          icon: <AlertTriangle className="h-4 w-4" />,
          duration: 5000,
        })
      }
    }
  }, [data])

  return (
    <div className="flex flex-col items-center min-h-screen p-4" dir="rtl">
      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8 space-y-8">
        <h1 className="font-bold text-xl text-center">
          معاون انضباطی - مدیریت حضور و غیاب
        </h1>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="date-picker" className="mb-2 block font-medium">
              انتخاب تاریخ
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <DatePicker
                id="date-picker"
                calendar={persian}
                locale={persian_fa}
                value={selectedDate || null}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                containerStyle={{ width: '100%' }}
                inputClass="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                calendarPosition="bottom-right"
                placeholder="انتخاب تاریخ (مثال: ۱۴۰۴/۰۶/۱۱)"
              />
            </div>
          </div>
          <Button onClick={handleSetToday} className="w-full sm:w-auto">
            تنظیم به امروز
          </Button>
        </div>

        {!selectedDate && (
          <div className="text-center text-muted-foreground py-8">لطفاً یک تاریخ انتخاب کنید تا اطلاعات نمایش داده شود.</div>
        )}

        {selectedDate && (isAttendanceLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : data && (
          <>
            <h2 className="text-lg font-semibold mb-6 text-center flex items-center justify-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              حضور و غیاب تاریخ {displayDate}
            </h2>
            <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden">
              {data.map((classItem: ClassAttendance, index: number) => (
                <AccordionItem value={`class-${index}`} key={index} className="border-b last:border-0">
                  <AccordionTrigger className="text-right hover:bg-neutral-100 hover:no-underline bg-neutral-50 items-center px-4 cursor-pointer font-medium">
                    {classItem.className}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2 bg-white">
                    {classItem.attendance.map((att: Attendance, attIndex: number) => {
                      const isConfirmed = att.confirmedBy?.disciplinaryDeputy || false
                      const key = `${classItem.className}-${att.period}` // Assume className available
                      const editingData = editingStates[key] || { report: att.report, attendances: att.studentsAttendance }
                      const absentCount = editingData.attendances.filter(sa => sa.status === 'absent').length

                      return (
                        <Card key={attIndex} className={`mb-6 shadow-sm ${isConfirmed ? 'bg-gray-50' : 'bg-white'}`}>
                          <CardHeader className="border-b">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">زنگ {att.period}: {att.subject}</CardTitle>
                              <Badge variant={isConfirmed ? 'default' : 'secondary'} className="flex gap-1">
                                {isConfirmed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                {isConfirmed ? 'تایید شده' : 'نیاز به تایید'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2 space-y-1">
                              <p>روز: {dayMap[att.day.toLowerCase()] || att.day}</p>
                              <p>معلم: {att.teacher.first_name} {att.teacher.last_name}</p>
                              <p>تعداد غایب: {absentCount}</p>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="mb-4">
                              <Label htmlFor={`report-${key}`} className="mb-2 block font-medium">گزارش معلم</Label>
                              <Textarea
                                id={`report-${key}`}
                                value={editingData.report}
                                onChange={(e) => handleReportChange(e.target.value, classItem.className, att.period)}
                                disabled={isConfirmed || updateAttendanceMutation.isPending}
                                className="min-h-[100px]"
                                placeholder="گزارش معلم..."
                              />
                            </div>
                            <h4 className="font-bold mb-3 flex items-center gap-2"><Edit2 className="h-4 w-4" />حضور و غیاب دانش‌آموزان</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-start">نام</TableHead>
                                  <TableHead className="text-start">نام خانوادگی</TableHead>
                                  <TableHead className="text-start">وضعیت</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {editingData.attendances.map((stuAtt: StudentAttendance, stuIndex: number) => (
                                  <TableRow key={stuIndex} className={isConfirmed ? 'text-muted-foreground' : ''}>
                                    <TableCell>{stuAtt.student.first_name}</TableCell>
                                    <TableCell>{stuAtt.student.last_name}</TableCell>
                                    <TableCell>
                                      {isConfirmed ? (
                                        <span className={statusColors[stuAtt.status]}>
                                          {statusMap[stuAtt.status] || stuAtt.status}
                                        </span>
                                      ) : (
                                        <Select
                                          value={stuAtt.status}
                                          onValueChange={(value: 'present' | 'absent' | 'late') => handleStatusChange(stuAtt.student._id, value, classItem.className, att.period)}
                                        >
                                          <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="present">حاضر</SelectItem>
                                            <SelectItem value="absent">غایب</SelectItem>
                                            <SelectItem value="late">تاخیر</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            {!isConfirmed && (
                              <div className="mt-4 flex gap-4">
                                <Button
                                  onClick={() => handleSaveChanges(att, classItem.className)}
                                  disabled={updateAttendanceMutation.isPending}
                                  className="flex gap-2"
                                >
                                  <Save className="h-4 w-4" /> ذخیره تغییرات
                                </Button>
                                <Button
                                  onClick={() => handleConfirm(att, classItem.className)}
                                  variant="default"
                                  disabled={confirmMutation.isPending}
                                >
                                  تایید نهایی
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        ))}

        {selectedDate && (isMissingLoading ? (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : missingAttendances && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-6 text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              عدم ثبت حضور و غیاب تاریخ {displayDate}
            </h2>
            {missingAttendances.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 flex justify-center items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> همه حضور و غیاب‌ها ثبت شده است
              </div>
            ) : (
              <Table className="border rounded-lg overflow-hidden">
                <TableHeader className="bg-neutral-50">
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
                    <TableRow key={index} className="hover:bg-neutral-50">
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
                          size="sm"
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
        ))}

        <Button asChild variant="outline" className='mt-8 w-full sm:w-auto'>
          <Link to="/admin">بازگشت به داشبورد</Link>
        </Button>
      </div>
    </div>
  )
}

export default DisciplinaryDeputyReports