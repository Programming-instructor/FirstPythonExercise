import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Edit2, Save, XCircle } from 'lucide-react';
import { useConfirmStudentReport } from '@/hooks/useConfirmStudentReport';
import { useEditStudentReport } from '@/hooks/useEditStudentReport';
import { Link } from 'react-router-dom';
import { useGetStudentReports } from '@/hooks/useGetStudentReports';
import { useFetchStudentByCode } from '@/hooks/useFetchStudnetByNationalCode';
import ReadOnlyStudent from '@/components/admin/global/ReadOnlyStudent';
import Breadcrumb from '@/components/admin/global/Breadcrumb';

const PrincipalStudentReports = () => {
  const [nationalCode, setNationalCode] = useState('');
  const [submittedCode, setSubmittedCode] = useState('');
  const [editingStates, setEditingStates] = useState<Record<string, { message: string; date: string }>>({});

  const { data: reportsData, isLoading: reportsLoading, refetch } = useGetStudentReports(nationalCode);
  console.log(reportsData)
  const { data: student, isLoading: studentLoading, error: studentError } = useFetchStudentByCode(submittedCode);

  const confirmMutation = useConfirmStudentReport();
  const editMutation = useEditStudentReport();

  const handleSubmitCode = () => {
    if (!/^\d{10}$/.test(nationalCode)) {
      toast.error('لطفاً یک کد ملی ۱۰ رقمی معتبر وارد کنید');
      return;
    }
    setSubmittedCode(nationalCode);
  };

  const initializeEditingState = (report: any) => {
    if (!editingStates[report._id]) {
      setEditingStates(prev => ({
        ...prev,
        [report._id]: {
          message: report.message,
          date: report.date,
        },
      }));
    }
  };

  const handleMessageChange = (value: string, reportId: string) => {
    setEditingStates(prev => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        message: value,
      },
    }));
  };

  const handleDateChange = (value: string, reportId: string) => {
    setEditingStates(prev => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        date: value,
      },
    }));
  };

  const handleSaveEdit = (reportId: string) => {
    const editingData = editingStates[reportId];
    if (!editingData) return;

    editMutation.mutate(
      { reportId, message: editingData.message, date: editingData.date },
      {
        onSuccess: () => {
          toast.success('گزارش با موفقیت ویرایش شد');
          refetch();
        },
        onError: () => {
          toast.error('خطا در ویرایش گزارش');
        },
      }
    );
  };

  const handleConfirm = (reportId: string) => {
    confirmMutation.mutate(reportId, {
      onSuccess: () => {
        toast.success('گزارش با موفقیت تایید شد');
        refetch();
      },
      onError: () => {
        toast.error('خطا در تایید گزارش');
      },
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4" dir="rtl">
      <div className="w-full max-w-5xl mx-auto">
        <Breadcrumb
          items={[
            { link: '/admin', text: 'داشبورد' },
            { link: '/admin/principal', text: 'مدیریت' },
            { text: 'گزارش‌های دانش‌آموز ' },
          ]}
        />
      </div>
      <div className="w-full max-w-5xl bg-white shadow rounded-2xl p-8 space-y-8">
        <h1 className="font-bold text-xl text-center">مدیر - گزارش‌های دانش‌آموز</h1>

        <div>
          <Label htmlFor="national_code" className="text-sm font-semibold">
            کد ملی دانش‌آموز
          </Label>
          <div className="flex gap-4 mt-2">
            <Input
              id="national_code"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              placeholder="کد ملی ۱۰ رقمی را وارد کنید"
              className="max-w-md"
            />
            <Button onClick={handleSubmitCode} disabled={reportsLoading || studentLoading || !/^\d{10}$/.test(nationalCode)}>
              {reportsLoading || studentLoading ? 'در حال جستجو...' : 'جستجوی گزارش‌ها'}
            </Button>
          </div>
        </div>

        {student && <ReadOnlyStudent short student={student} />}

        {!submittedCode && (
          <div className="text-center text-muted-foreground py-8">
            لطفاً کد ملی دانش‌آموز را وارد کنید تا گزارش‌ها نمایش داده شود.
          </div>
        )}

        {submittedCode && (reportsLoading || studentLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : reportsData && (
          <>
            <h2 className="text-lg font-semibold mb-6 text-center">
              گزارش‌های دانش‌آموز (تعداد: {reportsData.amount})
            </h2>

            <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden">
              {reportsData.reports.map((report: any, index: number) => {
                initializeEditingState(report);
                const editingData = editingStates[report._id] || { message: report.message, date: report.date };
                const isConfirmed = report.confirmed;

                return (
                  <AccordionItem value={`report-${index}`} key={index} className="border-b last:border-0">
                    <AccordionTrigger className="text-right hover:bg-neutral-100 hover:no-underline bg-neutral-50 items-center px-4 cursor-pointer font-medium">
                      گزارش {index + 1} - تاریخ: {report.date}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2 bg-white">
                      <Card className={`shadow-sm ${isConfirmed ? 'bg-gray-50' : 'bg-white'}`}>
                        <CardHeader className="border-b">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">جزئیات گزارش</CardTitle>
                            <Badge variant={isConfirmed ? 'default' : 'secondary'} className="flex gap-1 max-w-fit">
                              {isConfirmed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              {isConfirmed ? 'تایید شده' : 'نیاز به تایید'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2 space-y-1">
                            <p>از: {report.from?.name}</p>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          <div>
                            <Label htmlFor={`date-${report._id}`} className="mb-2 block font-medium">تاریخ</Label>
                            <Input
                              id={`date-${report._id}`}
                              type="date"
                              value={editingData.date}
                              onChange={(e) => handleDateChange(e.target.value, report._id)}
                              disabled={isConfirmed || editMutation.isPending}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`message-${report._id}`} className="mb-2 block font-medium">پیام</Label>
                            <Textarea
                              id={`message-${report._id}`}
                              value={editingData.message}
                              onChange={(e) => handleMessageChange(e.target.value, report._id)}
                              disabled={isConfirmed || editMutation.isPending}
                              className="min-h-[100px]"
                              placeholder="پیام گزارش..."
                            />
                          </div>
                          {!isConfirmed && (
                            <div className="flex gap-4">
                              <Button
                                onClick={() => handleSaveEdit(report._id)}
                                disabled={editMutation.isPending}
                                className="flex gap-2"
                              >
                                <Save className="h-4 w-4" />
                                ذخیره تغییرات
                              </Button>
                              <Button
                                onClick={() => handleConfirm(report._id)}
                                variant="default"
                                disabled={confirmMutation.isPending}
                              >
                                تایید گزارش
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </>
        ))}

        <Button asChild variant="outline" className="mt-8 w-full sm:w-auto">
          <Link to="/admin">بازگشت به داشبورد</Link>
        </Button>
      </div>
    </div>
  );
};

export default PrincipalStudentReports;