import React, { ReactNode } from 'react';
import { Divider, Flex } from '@components/General';
import { ChevronDown } from 'lucide-react';

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
    <div className={`my-4 ${className}`}>
      <Flex
        className="cursor-pointer select-none hover:text-sky-300"
        onClick={toggleAccordion}
      >
        <div className="relative pr-3">
          <ChevronDown
            className={`acc-icon transition-all ${!isOpen && 'rotate-180'}`}
          />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </Flex>
      {isOpen && <Divider size={1} className="w-[85%] top-2 relative mb-8" />}
      {isOpen && <div className="mb-2 select-none">{children}</div>}
    </div>
  );
};

export default Accordion;
