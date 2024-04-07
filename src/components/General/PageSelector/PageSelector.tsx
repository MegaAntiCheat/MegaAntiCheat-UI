import React, { useState } from 'react';

interface PageSelectorProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PageSelector: React.FC<PageSelectorProps> = ({ totalPages, currentPage, onPageChange }) => {
  const [selectedPage, setSelectedPage] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setSelectedPage(page);
    onPageChange(page);
  };

  return (
    <div className='flex justify-center'>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          disabled={page === selectedPage}
          onClick={() => handlePageChange(page)}
          className={`p-2 ${page === selectedPage ? 'bg-white text-black' : ''}`}
        >
          {page + ' '}
        </button>
      ))}
    </div>
  );
};

export default PageSelector;