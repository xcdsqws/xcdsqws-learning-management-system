import { checkAdmin } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import { getAllAssignments, getSubjects, getAllStudents } from "@/lib/db"
import AdminAssignmentList from "@/components/admin/assignment-list"

export default async function AdminAssignmentsPage() {
  const admin = await checkAdmin()
  const assignments = await getAllAssignments()
  const subjects = await getSubjects()
  const students = await getAllStudents()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={admin} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">과제 관리</h1>

        <AdminAssignmentList assignments={assignments} subjects={subjects} students={students} />
      </main>
    </div>
  )
}
