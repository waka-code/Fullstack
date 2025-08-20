import React, { useCallback } from 'react';
import { usePagination } from '../hooks/usePagination';

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
    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <span className="text-sm text-gray-500">Loading pagination...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={paginationData.handlePrevious}
        disabled={currentPage === 1 || loading}
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
          ${currentPage === 1 || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }
        `}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      <div className="flex space-x-1">
        {paginationData.pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => !loading && onPageChange(pageNum)}
            disabled={loading}
            className={`
              px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              ${pageNum === currentPage
                ? 'bg-primary-600 text-white'
                : loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }
            `}
            aria-label={`Ir a página ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={paginationData.handleNext}
        disabled={currentPage === totalPages || loading}
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
          ${currentPage === totalPages || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }
        `}
        aria-label="Página siguiente"
      >
        Siguiente
      </button>

      <span className="text-sm text-gray-500 ml-4">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
