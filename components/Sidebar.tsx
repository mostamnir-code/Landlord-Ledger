import React from 'react';

const ChartPieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
  </svg>
);
const HomeModernIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m-7.5 0l7.5 2.727m-7.5-2.727l-7.5 2.727M12 3v9.75m-9 3.75l9-3.25m9 3.25l-9-3.25" />
  </svg>
);

const ArrowsRightLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 7.5m0 0L16.5 12M21 7.5H3" />
  </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 01-12 0m12 0v-1.04a4.5 4.5 0 00-4.5-4.5h-3a4.5 4.5 0 00-4.5 4.5v1.04m12 0a9.094 9.094 0 01-12 0M12 12.75a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);


interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
      isActive
        ? 'bg-primary-500 text-white shadow'
        : 'text-slate-600 hover:bg-primary-100 hover:text-primary-700'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-white p-4 border-r border-slate-200 hidden md:block">
      <nav className="space-y-2">
        <NavItem
          icon={<ChartPieIcon className="w-6 h-6" />}
          label="Dashboard"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          icon={<HomeModernIcon className="w-6 h-6" />}
          label="Properties"
          isActive={activeView === 'properties'}
          onClick={() => setActiveView('properties')}
        />
        <NavItem
          icon={<ArrowsRightLeftIcon className="w-6 h-6" />}
          label="Transactions"
          isActive={activeView === 'transactions'}
          onClick={() => setActiveView('transactions')}
        />
        <NavItem
          icon={<UsersIcon className="w-6 h-6" />}
          label="Tenants"
          isActive={activeView === 'tenants'}
          onClick={() => setActiveView('tenants')}
        />
      </nav>
    </aside>
  );
};
