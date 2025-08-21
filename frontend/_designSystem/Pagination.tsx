import { usePagination } from '../src/hooks/usePagination';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false
}) => {

  const paginationData = usePagination({
    currentPage,
    totalPages,
    onPageChange,
    loading
  });

  if (!paginationData) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        onClick={paginationData.handlePrevious}
        disabled={currentPage === 1 || loading}
        variant="ghost"
        size="sm"
      >
        Previous
      </Button>

      <div className="flex space-x-1">
        {paginationData.pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => !loading && onPageChange(pageNum)}
            disabled={loading}
            variant={pageNum === currentPage ? "primary" : "ghost"}
            size="sm"
          >
            {pageNum}
          </Button>
        ))}
      </div>

      <Button
        onClick={paginationData.handleNext}
        disabled={currentPage === totalPages || loading}
        variant="ghost"
        size="sm"
      >
        Next
      </Button>

      <span className="text-sm text-gray-500 ml-4">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
