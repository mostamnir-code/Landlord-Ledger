
import React from 'react';

const BuildingOfficeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6.75h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M12.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 border-b border-slate-200">
      <div className="flex items-center space-x-2">
        <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />
        <h1 className="text-xl font-bold text-slate-800">Landlord Ledger</h1>
      </div>
    </header>
  );
};
