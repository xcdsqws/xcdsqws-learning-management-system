import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getAssignmentsByStudent, getSubjects } from "@/lib/db"
import AssignmentList from "@/components/assignments/assignment-list"
import CreateAssignmentForm from "@/components/assignments/create-assignment-form"

export default async function AssignmentsPage() {
  const user = await checkAuth()
  const assignments = await getAssignmentsByStudent(user.id)
  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">과제 관리</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AssignmentList assignments={assignments} subjects={subjects} />
          </div>

          <div>
            <CreateAssignmentForm subjects={subjects} />
          </div>
        </div>
      </main>
    </div>
  )
}
