import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { FieldMapperKeys } from "@/utils/fieldMapper";

interface AccordionFormProps {
  fields: FieldMapperKeys[];
  completed: boolean;
  values?: Partial<Record<FieldMapperKeys, string>>;
  onSubmit?: (data: Record<FieldMapperKeys, string>) => void;
  isSubmitting?: boolean;
}

const fieldInputConfig: Record<
  FieldMapperKeys,
  { type: "Input" | "Textarea" | "Select"; options?: string[] }
> = {
  "نقاط قوت درسی": { type: "Textarea" },
  "نقاط ضعف درسی": { type: "Textarea" },
  "علاقه‌مندی‌های درسی": { type: "Textarea" },
  "رشته مورد علاقه برای ادامه تحصیل": { type: "Input" },
  "وضعیت انضباطی": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "ساعات مطالعه روزانه": { type: "Input" },
  "فعالیت‌های فوق برنامه (المپیاد، کلاس زبان، ورزش و ...)": { type: "Textarea" },
  "نیاز به کلاس تقویتی": { type: "Select", options: ["دارد", "ندارد"] },
  "سطح همکاری در کلاس": { type: "Select", options: ["عالی", "خوب", "متوسط", "ضعیف"] },
  "وضعیت تکالیف و پروژه‌ها": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "مهارت‌های یادگیری (یادداشت‌برداری، خلاصه‌نویسی و ...)": { type: "Textarea" },
  "توضیحات تکمیلی مشاور تحصیلی": { type: "Textarea" },
  "نتیجه نهایی مشاور تحصیلی (پذیرش/عدم پذیرش)": { type: "Select", options: ["پذیرش", "عدم پذیرش"] },
  "مدارک تحصیلی ارائه‌شده": { type: "Textarea" },
  "کارنامه سال گذشته": { type: "Textarea" },
  "نمره دروس اصلی (ریاضی، علوم، ادبیات، زبان)": { type: "Input" },
  "حضور و غیاب در مدارس قبلی": { type: "Textarea" },
  "وضعیت انتقالی یا تغییر مدرسه": { type: "Select", options: ["بدون انتقال", "انتقال از مدرسه دیگر", "تغییر رشته"] },
  "سطح زبان خارجی": { type: "Select", options: ["مبتدی", "متوسط", "پیشرفته"] },
  "میزان مشارکت در فعالیت‌های کلاسی": { type: "Select", options: ["فعال", "متوسط", "غیرفعال"] },
  "مشکلات آموزشی پیشین": { type: "Textarea" },
  "نیاز به امکانات آموزشی خاص (کتاب، ابزار و ...)": { type: "Textarea" },
  "پیشنهاد برای کلاس‌بندی": { type: "Textarea" },
  "وضعیت سوابق تحصیلی در سال‌های قبل": { type: "Textarea" },
  "توضیحات تکمیلی معاون آموزشی": { type: "Textarea" },
  "نتیجه نهایی معاون آموزشی (پذیرش/عدم پذیرش)": { type: "Select", options: ["پذیرش", "عدم پذیرش"] },
  "وضعیت خانواده (شغلی، اقتصادی، فرهنگی)": { type: "Textarea" },
  "وضعیت سکونت (نزدیکی به مدرسه، خوابگاه و ...)": { type: "Textarea" },
  "تعامل والدین با مدرسه": { type: "Select", options: ["عالی", "خوب", "متوسط", "ضعیف"] },
  "توانایی‌های ویژه دانش‌آموز": { type: "Textarea" },
  "نیازهای خاص (سلامتی، مالی، آموزشی)": { type: "Textarea" },
  "اهداف خانواده از ثبت‌نام": { type: "Textarea" },
  "پیشینه حضور در مدارس دیگر": { type: "Textarea" },
  "تصویر کلی از رفتار اجتماعی": { type: "Textarea" },
  "ارزیابی کلی مدیر از دانش‌آموز": { type: "Textarea" },
  "توضیحات تکمیلی مدیر": { type: "Textarea" },
  "نتیجه نهایی مدیر (پذیرش/عدم پذیرش)": { type: "Select", options: ["پذیرش", "عدم پذیرش"] },
  "وضعیت روحی/روانی کلی": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به توجه"] },
  "سطح اعتماد به نفس": { type: "Select", options: ["بالا", "متوسط", "پایین"] },
  "سطح اضطراب و استرس": { type: "Select", options: ["کم", "متوسط", "زیاد"] },
  "مهارت‌های اجتماعی": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "ارتباط با همسالان": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "ارتباط با والدین": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "مشکلات خانوادگی احتمالی": { type: "Textarea" },
  "سابقه مراجعه به مشاور یا روانپزشک": { type: "Select", options: ["دارد", "ندارد"] },
  "مشکلات رفتاری احتمالی": { type: "Textarea" },
  "نقاط قوت شخصیتی": { type: "Textarea" },
  "سبک یادگیری ترجیحی (دیداری، شنیداری، عملی)": { type: "Select", options: ["دیداری", "شنیداری", "عملی", "ترکیبی"] },
  "میزان انگیزه برای تحصیل": { type: "Select", options: ["بالا", "متوسط", "پایین"] },
  "توصیه‌های مشاور روانشناسی": { type: "Textarea" },
  "نتیجه نهایی مشاور روانشناسی (پذیرش/عدم پذیرش)": { type: "Select", options: ["پذیرش", "عدم پذیرش"] },
  "سابقه انضباطی در مدارس قبلی": { type: "Textarea" },
  "گزارش‌های انضباطی سال گذشته": { type: "Textarea" },
  "وضعیت رفتار در کلاس": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "حوادث گزارش‌شده": { type: "Textarea" },
  "درگیری با همکلاسی‌ها": { type: "Select", options: ["ندارد", "کم", "متوسط", "زیاد"] },
  "رعایت قوانین مدرسه": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "تعامل با معلمان": { type: "Select", options: ["عالی", "خوب", "متوسط", "نیاز به بهبود"] },
  "نیاز به نظارت ویژه": { type: "Select", options: ["دارد", "ندارد"] },
  "پیشنهادات انضباطی": { type: "Textarea" },
  "توضیحات تکمیلی معاون انضباطی": { type: "Textarea" },
  "نتیجه نهایی معاون انضباطی (پذیرش/عدم پذیرش)": { type: "Select", options: ["پذیرش", "عدم پذیرش"] },
};

export default function AccordionForm({
  fields,
  completed,
  values = {},
  onSubmit,
  isSubmitting = false,
}: AccordionFormProps) {
  const [formData, setFormData] = useState<Record<FieldMapperKeys, string>>(
    fields.reduce((acc, field) => {
      acc[field] = values[field] || "";
      return acc;
    }, {} as Record<FieldMapperKeys, string>)
  );
  const [isOpen, setIsOpen] = useState(!completed);

  const handleChange = (field: FieldMapperKeys, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
      setIsOpen(false); // Close the accordion after submission
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-2xl border shadow-sm"
      value={isOpen ? "form" : ""}
      onValueChange={(value) => setIsOpen(value === "form")}
    >
      <AccordionItem value="form">
        <AccordionTrigger className="px-4 py-3 font-semibold bg-muted rounded-t-2xl cursor-pointer">
          {completed ? "مشاهده فرم ارسال‌شده" : "پر کردن فرم"}
        </AccordionTrigger>

        <AccordionContent>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => {
                  const config = fieldInputConfig[field] || { type: "Input" }; // Fallback to Input if not specified

                  return (
                    <div key={field} className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">{field}</label>

                      {completed ? (
                        <div className="text-sm bg-muted p-2 rounded-md">
                          {formData[field] || "بدون داده"}
                        </div>
                      ) : config.type === "Select" ? (
                        <Select
                          onValueChange={(val) => handleChange(field, val)}
                          value={formData[field] || ""}
                        >
                          <SelectTrigger dir="rtl" className="cursor-pointer w-full">
                            <SelectValue placeholder="انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent dir="rtl">
                            {config.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : config.type === "Textarea" ? (
                        <Textarea
                          value={formData[field] || ""}
                          onChange={(e) => handleChange(field, e.target.value)}
                          disabled={isSubmitting}
                        />
                      ) : (
                        <Input
                          value={formData[field] || ""}
                          onChange={(e) => handleChange(field, e.target.value)}
                          disabled={isSubmitting}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {!completed && (
                <div className="flex justify-start mt-6">
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "در حال ارسال..." : "ارسال"}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}