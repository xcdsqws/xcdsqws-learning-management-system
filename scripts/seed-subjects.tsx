"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function SeedSubjects() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeedSubjects = async () => {
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const subjects = [
        { id: "korean", name: "국어" },
        { id: "math", name: "수학" },
        { id: "english", name: "영어" },
        { id: "science", name: "과학" },
        { id: "social", name: "사회" },
        { id: "history", name: "역사" },
        { id: "physics", name: "물리" },
        { id: "chemistry", name: "화학" },
        { id: "biology", name: "생물" },
      ]

      // Supabase 클라이언트 가져오기
      const { supabaseAdmin } = await import("@/lib/supabase")

      // 과목 데이터 추가
      const { data, error } = await supabaseAdmin.from("subjects").upsert(subjects, { onConflict: "id" }).select()

      if (error) throw error

      setSuccess(`${subjects.length}개의 기본 과목이 성공적으로 추가되었습니다.`)
    } catch (err: any) {
      console.error("과목 데이터 추가 오류:", err)
      setError(err.message || "과목 데이터를 추가하는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>기본 과목 데이터 추가</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <p className="mb-4 text-sm text-gray-600">
            학습 관리 시스템에 기본 과목 데이터를 추가합니다. 이 작업은 한 번만 수행하면 됩니다.
          </p>

          <Button onClick={handleSeedSubjects} className="w-full" disabled={isLoading}>
            {isLoading ? "추가 중..." : "기본 과목 추가"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
