import type { Metadata } from "next"
import { ReflectionList } from "@/components/admin/reflection-list"

export const metadata: Metadata = {
  title: "학생 성찰 관리 | 학습 관리 시스템",
  description: "학생들의 일일 학습 성찰을 관리하고 확인합니다.",
}

export default function AdminReflectionsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">학생 성찰 관리</h1>
      <ReflectionList />
    </div>
  )
}
