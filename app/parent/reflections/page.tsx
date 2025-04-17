import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getUserById, getReflectionsByStudent } from "@/lib/db"
import { redirect } from "next/navigation"
import ParentReflectionView from "@/components/parent/reflection-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "자녀 성찰 기록 | 학습 관리 시스템",
  description: "자녀의 일일 학습 성찰 기록",
}

export default async function ParentReflectionsPage() {
  const user = await checkAuth()

  // 학부모만 접근 가능근 가능
  if (user.role !== "parent" || !user.child_id) {
    redirect("/dashboard")
  }

  // 자녀 정보 조회
  const child = await getUserById(user.child_id)
  if (!child) {
    redirect("/dashboard")
  }

  // 자녀의 성찰 기록 조회 (최근 30일)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const startDate = thirtyDaysAgo.toISOString().split("T")[0]
  const reflections = await getReflectionsByStudent(child.id, startDate)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">자녀 학습 성찰</h1>
            <p className="text-muted-foreground">
              {child.name} ({child.grade}학년 {child.class}반 {child.number}번) 학생의 학습 성찰 기록
            </p>
          </div>
        </div>

        <ParentReflectionView reflections={reflections} />
      </main>
    </div>
  )
}
