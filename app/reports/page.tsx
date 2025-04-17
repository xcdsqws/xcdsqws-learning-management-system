import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import {
  getReportByStudent,
  getStudyLogsByStudent,
  getGradesByStudent,
  getSubjects,
  getReflectionsByStudent,
} from "@/lib/db"
import ReportView from "@/components/reports/report-view"
import GenerateReportButton from "@/components/reports/generate-report-button"
import ReflectionSummary from "@/components/reflections/reflection-summary"

export default async function ReportsPage() {
  const user = await checkAuth()
  const report = await getReportByStudent(user.id)
  const studyLogs = await getStudyLogsByStudent(user.id)
  const grades = await getGradesByStudent(user.id)
  const subjects = await getSubjects()

  // 성찰 기록 가져오기
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const startDate = thirtyDaysAgo.toISOString().split("T")[0]
  const reflections = await getReflectionsByStudent(user.id, startDate)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">학습 리포트</h1>
          <GenerateReportButton />
        </div>

        {report ? (
          <div className="space-y-6">
            <ReportView report={report} studyLogs={studyLogs} grades={grades} subjects={subjects} />

            {/* 성찰 요약 추가 */}
            <ReflectionSummary reflections={reflections} period="all" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">아직 생성된 리포트가 없습니다.</h2>
            <p className="text-gray-600 mb-6">학습 리포트를 생성하려면 '리포트 생성' 버튼을 클릭하세요.</p>
            <GenerateReportButton />
          </div>
        )}
      </main>
    </div>
  )
}
