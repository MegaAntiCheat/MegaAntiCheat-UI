import React, { ReactNode } from 'react';
import './Accordion.css';
import { Divider, Flex } from '@components/General';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className={`accordion ${className}`}>
      <Flex
        className={`accordion-header ${isOpen ? 'open' : ''}`}
        onClick={toggleAccordion}
      >
        <div className="accordion-icon">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
        <h3 className="accordion-title">{title}</h3>
      </Flex>
      {isOpen && <Divider size={1} className="accordion-divider" />}
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;
