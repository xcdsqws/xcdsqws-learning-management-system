import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getGradesByStudent, getSubjects } from "@/lib/db"
import GradeList from "@/components/grades/grade-list"

export default async function GradesPage() {
  const user = await checkAuth()
  const grades = await getGradesByStudent(user.id)
  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">성적 관리</h1>

        <div>
          <GradeList grades={grades} subjects={subjects} />
        </div>
      </main>
    </div>
  )
}
