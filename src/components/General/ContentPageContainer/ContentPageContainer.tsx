import React, { ReactNode } from 'react';
import './ContentPageContainer.css';

interface ContentPageProps {
  children: ReactNode;
}

const ContentPageContainer = ({ children }: ContentPageProps) => {
  return <div className="content-page">{children}</div>;
};

export default ContentPageContainer;
