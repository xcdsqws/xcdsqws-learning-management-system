import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getReflectionsByStudent } from "@/lib/db"
import DailyReflectionForm from "@/components/reflections/daily-reflection-form"
import ReflectionHistory from "@/components/reflections/reflection-history"

export default async function ReflectionsPage() {
  const user = await checkAuth()

  // 최근 30일간의 성찰 기록 가져오기
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const startDate = thirtyDaysAgo.toISOString().split("T")[0]

  const reflections = await getReflectionsByStudent(user.id, startDate)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">학습 성찰</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DailyReflectionForm />
          </div>

          <div>
            <ReflectionHistory reflections={reflections} />
          </div>
        </div>
      </main>
    </div>
  )
}
