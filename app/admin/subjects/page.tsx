import { checkAdmin } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import { getSubjects } from "@/lib/db"
import SubjectList from "@/components/admin/subject-list"
import CreateSubjectForm from "@/components/admin/create-subject-form"

export default async function AdminSubjectsPage() {
  const admin = await checkAdmin()
  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={admin} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">과목 관리</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SubjectList subjects={subjects} />
          </div>

          <div>
            <CreateSubjectForm />
          </div>
        </div>
      </main>
    </div>
  )
}
