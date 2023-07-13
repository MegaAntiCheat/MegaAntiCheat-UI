import React, { ReactNode } from 'react';
import './Accordion.css';
import { Flex } from '@components/General';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Accordion {
  title?: string;
  children?: ReactNode;
  className?: string;
}

const Accordion = ({ title, children, className }: Accordion) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;
