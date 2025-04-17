import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getUserById, getReportByStudent, getStudyLogsByStudent, getGradesByStudent, getSubjects } from "@/lib/db"
import { redirect } from "next/navigation"
import ParentReportView from "@/components/parent/report-view"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ParentReportsPage() {
  const user = await checkAuth()

  // 학부모만 접근 가능
  if (user.role !== "parent" || !user.child_id) {
    redirect("/dashboard")
  }

  // 자녀 정보 조회
  const child = await getUserById(user.child_id)
  if (!child) {
    redirect("/dashboard")
  }

  // 자녀의 리포트, 학습 로그, 성적, 과목 조회
  const report = await getReportByStudent(child.id)
  const studyLogs = await getStudyLogsByStudent(child.id)
  const grades = await getGradesByStudent(child.id)
  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">학습 리포트</h1>
            <p className="text-muted-foreground">
              {child.name} ({child.grade}학년 {child.class}반 {child.number}번) 학생의 학습 리포트
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/parent/dashboard">
              <Button variant="outline">대시보드로 돌아가기</Button>
            </Link>
          </div>
        </div>

        {report ? (
          <ParentReportView report={report} studyLogs={studyLogs} grades={grades} subjects={subjects} />
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">아직 생성된 리포트가 없습니다.</h2>
            <p className="text-gray-600 mb-6">
              리포트는 학생이 충분한 학습 데이터를 쌓은 후 생성됩니다. 자녀에게 학습 기록을 남기도록 권장해주세요.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
