import React, { ReactNode } from "react";
import "./ContentPageContainer.css";

interface ContentPageType {
  children: ReactNode;
}

const ContentPageContainer = ({ children }: ContentPageType) => {
  return <div className="content-page">{children}</div>;
};

export default ContentPageContainer;
