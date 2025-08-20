import { useCallback } from 'react'
import { PaginationProps } from '../components/Pagination';

export function usePagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false
}: PaginationProps) {
 if (totalPages <= 1) return null;

 const handlePrevious = useCallback(() => {
  if (currentPage > 1 && !loading) {
   onPageChange(currentPage - 1);
  }
 }, [currentPage, loading, onPageChange]);

 const handleNext = useCallback(() => {
  if (currentPage < totalPages && !loading) {
   onPageChange(currentPage + 1);
  }
 }, [currentPage, loading, onPageChange]);

 const generatePageNumbers = useCallback(() => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Ajustar si hay menos páginas al final
  if (endPage - startPage + 1 < maxVisiblePages) {
   startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
   pages.push(i);
  }

  return pages;
 }, [currentPage, totalPages]);

 const pageNumbers = generatePageNumbers();
 
 return {
  pageNumbers,
  handlePrevious,
  handleNext
 }
}
