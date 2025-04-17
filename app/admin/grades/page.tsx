import { checkAdmin } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import { getAllStudents, getSubjects } from "@/lib/db"
import AdminGradeList from "@/components/admin/grade-list"
import AdminCreateGradeForm from "@/components/admin/create-grade-form"

export default async function AdminGradesPage() {
  const admin = await checkAdmin()
  const students = await getAllStudents()
  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={admin} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">성적 관리</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminGradeList students={students} subjects={subjects} />
          </div>

          <div>
            <AdminCreateGradeForm students={students} subjects={subjects} />
          </div>
        </div>
      </main>
    </div>
  )
}
