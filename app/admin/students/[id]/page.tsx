import { checkAdmin } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import { getUserById, getAssignmentsByStudent, getStudyLogsByStudent, getGradesByStudent, getSubjects } from "@/lib/db"
import { notFound } from "next/navigation"
import StudentDetail from "@/components/admin/student-detail"

interface StudentDetailPageProps {
  params: {
    id: string
  }
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const admin = await checkAdmin()
  const student = await getUserById(params.id)

  if (!student || student.role !== "student") {
    notFound()
  }

  const assignments = await getAssignmentsByStudent(student.id)
  const studyLogs = await getStudyLogsByStudent(student.id)
  const grades = await getGradesByStudent(student.id)
  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={admin} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">학생 상세 정보</h1>

        <StudentDetail
          student={student}
          assignments={assignments}
          studyLogs={studyLogs}
          grades={grades}
          subjects={subjects}
        />
      </main>
    </div>
  )
}
