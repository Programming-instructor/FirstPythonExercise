import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button variant="outline" onClick={handlePrev} disabled={currentPage === 1}>
        قبلی
      </Button>
      <span className="px-2">
        صفحه {currentPage} از {totalPages}
      </span>
      <Button variant="outline" onClick={handleNext} disabled={currentPage === totalPages}>
        بعدی
      </Button>
    </div>
  );
};
