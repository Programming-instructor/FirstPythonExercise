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
      value={isOpen ? "form" : ""} // Use "" instead of undefined for closed state
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
                  const isFinalResult = field.includes("نتیجه نهایی");
                  const isNotes = field.includes("توضیحات");

                  return (
                    <div key={field} className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">{field}</label>

                      {completed ? (
                        <div className="text-sm bg-muted p-2 rounded-md">
                          {formData[field] || "بدون داده"}
                        </div>
                      ) : isFinalResult ? (
                        <Select
                          onValueChange={(val) => handleChange(field, val)}
                          value={formData[field] || ""}
                        >
                          <SelectTrigger dir="rtl" className="cursor-pointer w-full">
                            <SelectValue placeholder="انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent dir="rtl">
                            <SelectItem value="پذیرش">پذیرش</SelectItem>
                            <SelectItem value="عدم پذیرش">عدم پذیرش</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : isNotes ? (
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