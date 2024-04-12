import { toContainElement } from '@testing-library/jest-dom/matchers';
import React from 'react';

interface PageSelectorProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PageSelector: React.FC<PageSelectorProps> = ({ totalPages, currentPage, onPageChange }) => {

  if(totalPages === 0) totalPages = 1;

  const [selectedPage, setSelectedPage] = React.useState(currentPage);
  const [width, setWidth] = React.useState(-1);

  const handlePageChange = (page: number | "next" | "prev") => {

    if(page === "next") {
      page = Math.min(totalPages, selectedPage + 1);
    } else if (page === "prev") {
      page = Math.max(1, selectedPage - 1);
    }

    setSelectedPage(page);
    onPageChange(page);
  };

  const widthOfButtons = 40;

  const getButtonsToDisplay = (page: number): number[] => {

    let numbersToDisplay = Math.floor(width / widthOfButtons) - 2;
    if(numbersToDisplay % 2 === 0) numbersToDisplay++;

    if (numbersToDisplay >= totalPages + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const middleValue = Math.ceil(numbersToDisplay / 2);

    let pages = new Set<number>([1, totalPages]);

    if(page <= middleValue) {
      Array.from({ length: page }, (_, index) => index + 1).forEach(n => pages.add(n));
      for(let i = page; pages.size < numbersToDisplay; i++) {
        pages.add(i);
      }
    } else if (page >= totalPages - middleValue + 1) {
      Array.from({ length: totalPages - page + 1 }, (_, index) => totalPages - index).forEach(n => pages.add(n));
      for(let i = page; pages.size < numbersToDisplay; i--) {
        pages.add(i);
      }
    } else {
      pages.add(page);
      for(let i = 0; pages.size < numbersToDisplay; i--) {
        pages.add(page - i);
        pages.add(page + i);
      }
    }

    return Array.from(pages);
  }

  React.useEffect(() => {
    function handleResize() {
      if(window.innerWidth < 1024) { // lg
        setWidth((window.innerWidth - 100));
      } else {
        setWidth((window.innerWidth - 50) / 2);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonsToDisplay = getButtonsToDisplay(currentPage);

  return (
    <div className='flex justify-center'>
      <button
        key={"prev"}
        disabled={selectedPage === 1}
        onClick={() => handlePageChange("prev")}
        className={`min-w-pageselectorbutton p-2 ${selectedPage === 1 ? 'text-black' : ''}`}
      >
        {'<'}
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        (buttonsToDisplay.includes(page)) && (
          <button
            key={page}
            disabled={page === selectedPage}
            onClick={() => handlePageChange(page)}
            className={`min-w-pageselectorbutton p-2 ${page === selectedPage ? 'bg-white text-black' : ''}`}
          >
            {page + ' '}
          </button>
        )
      ))}
      <button
        key={"next"}
        disabled={selectedPage === totalPages}
        onClick={() => handlePageChange("next")}
        className={`min-w-pageselectorbutton p-2 ${selectedPage === totalPages ? 'text-black' : ''}`}
      >
        {'>'}
      </button>
    </div>
  );
};

export default PageSelector;