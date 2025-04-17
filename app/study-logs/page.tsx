import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getStudyLogsByStudent, getSubjects } from "@/lib/db"
import StudyLogList from "@/components/study-logs/study-log-list"
import CreateStudyLogForm from "@/components/study-logs/create-study-log-form"

export default async function StudyLogsPage() {
  const user = await checkAuth()
  const studyLogs = await getStudyLogsByStudent(user.id)
  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">학습 기록</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StudyLogList studyLogs={studyLogs} subjects={subjects} />
          </div>

          <div>
            <CreateStudyLogForm subjects={subjects} />
          </div>
        </div>
      </main>
    </div>
  )
}
