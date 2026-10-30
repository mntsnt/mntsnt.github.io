import { getPortfolioData, getMessages } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const initialData = await getPortfolioData();
  const initialMessages = await getMessages();

  return (
    <AdminDashboardClient
      initialData={initialData}
      initialMessages={initialMessages}
      userEmail={session.email}
    />
  );
}
