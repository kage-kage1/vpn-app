'use client';

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { toasts, removeToast } = useToast();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </AdminAuthProvider>
    </AuthProvider>
  );
}