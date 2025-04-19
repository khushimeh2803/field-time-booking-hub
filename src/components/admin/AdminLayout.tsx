
import React from "react";
import SidebarNav from "./SidebarNav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
