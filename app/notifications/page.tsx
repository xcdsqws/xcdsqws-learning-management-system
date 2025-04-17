import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getNotificationsByUser } from "@/lib/db"
import NotificationList from "@/components/notifications/notification-list"

export default async function NotificationsPage() {
  const user = await checkAuth()
  const notifications = await getNotificationsByUser(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">알림</h1>
        <NotificationList notifications={notifications} />
      </main>
    </div>
  )
}
