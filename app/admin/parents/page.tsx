import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getAllStudents, getParentsByStudent } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ParentList from "@/components/admin/parent-list"
import AddParentForm from "@/components/admin/add-parent-form"
import { redirect } from "next/navigation"

export default async function ParentsPage() {
  const user = await checkAuth()

  // 관리자만 접근 가능
  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  const students = await getAllStudents()

  // 각 학생별 학부모 계정 조회
  const studentsWithParents = await Promise.all(
    students.map(async (student) => {
      const parents = await getParentsByStudent(student.id)
      return {
        ...student,
        parents,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">학부모 계정 관리</h1>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">학부모 계정 목록</TabsTrigger>
            <TabsTrigger value="add">학부모 계정 추가</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>학부모 계정 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <ParentList studentsWithParents={studentsWithParents} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>학부모 계정 추가</CardTitle>
              </CardHeader>
              <CardContent>
                <AddParentForm students={students} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
