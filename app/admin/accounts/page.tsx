import { checkAdmin } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import AccountManagement from "@/components/admin/account-management"

export default async function AdminAccountsPage() {
  const admin = await checkAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={admin} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">계정 관리</h1>
        <AccountManagement />
      </main>
    </div>
  )
}
