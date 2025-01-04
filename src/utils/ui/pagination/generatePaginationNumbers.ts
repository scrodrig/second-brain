export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
  // If less than 7 no ellipsis

  if (totalPages < 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1) //
  }

  // If current page is less than 3

  if (currentPage < 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  // If current page is greater than totalPages - 2
  if (currentPage > totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  // If current page is between 3 and totalPages - 2
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}