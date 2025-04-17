import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExportDataForm from "@/components/admin/export-data-form"
import ImportDataForm from "@/components/admin/import-data-form"
import { redirect } from "next/navigation"

export default async function ExportPage() {
  const user = await checkAuth()

  // 관리자만 접근 가능
  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">데이터 내보내기/가져오기</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>데이터 내보내기</CardTitle>
            </CardHeader>
            <CardContent>
              <ExportDataForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>데이터 가져오기</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportDataForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
