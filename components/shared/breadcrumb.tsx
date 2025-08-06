import React from "react";
import { Home as HomeIcon, ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items?: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = ["Dashboard"] }) => {
  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          <HomeIcon className="w-4 h-4 mr-1" />
          <span>Dashboard</span>
        </li>
        {items.slice(1).map((item, idx) => (
          <React.Fragment key={idx}>
            <li className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              <span>{item}</span>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
