import React, { ReactNode } from 'react';
import './Accordion.css';
import { ChevronRight } from 'lucide-react';

interface AccordionProps {
  title?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion = ({
  title,
  children,
  className = '',
  defaultOpen = true,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`select-none flex-col gap-2 ${className}`}>
      <div
        onClick={toggleAccordion}
        className={`${isOpen && 'border-b border-outline/30'} flex cursor-pointer items-center gap-2 pb-2 hover:text-sky-300`}
      >
        <ChevronRight
          className={`${isOpen && 'rotate-90'} acc-icon h-fit transition-all`}
        />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {isOpen && <div className={'pt-2 md:px-8'}>{children}</div>}
    </div>
  );
};

export default Accordion;
