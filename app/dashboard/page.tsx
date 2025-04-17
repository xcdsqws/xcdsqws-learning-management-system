import { redirect } from "next/navigation"
import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSummary from "@/components/dashboard/summary"
import RecentAssignments from "@/components/dashboard/recent-assignments"
import StudyTimeChart from "@/components/dashboard/study-time-chart"
import GradeOverview from "@/components/dashboard/grade-overview"
import RecentReflections from "@/components/dashboard/recent-reflections"
import {
  getAssignmentsByStudent,
  getGradesByStudent,
  getStudyLogsByStudent,
  getSubjects,
  getReflectionsByStudent,
} from "@/lib/db"

export default async function DashboardPage() {
  const user = await checkAuth()

  if (user.role !== "student") {
    redirect("/admin/dashboard")
  }

  // 데이터 가져오기
  const assignments = await getAssignmentsByStudent(user.id)
  const studyLogs = await getStudyLogsByStudent(user.id)
  const grades = await getGradesByStudent(user.id)
  const subjects = await getSubjects()

  // 최근 7일간의 성찰 기록 가져오기
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const startDate = sevenDaysAgo.toISOString().split("T")[0]
  const reflections = await getReflectionsByStudent(user.id, startDate)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">학습 대시보드</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardSummary
            totalAssignments={assignments.length}
            pendingAssignments={assignments.filter((a) => a.status === "pending").length}
            totalStudyTime={studyLogs.reduce((total, log) => total + log.duration, 0)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentAssignments assignments={assignments.slice(0, 5)} subjects={subjects} />
          <StudyTimeChart studyLogs={studyLogs} subjects={subjects} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GradeOverview grades={grades} subjects={subjects} />
          <RecentReflections reflections={reflections} />
        </div>
      </main>
    </div>
  )
}
