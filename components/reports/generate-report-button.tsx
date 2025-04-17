"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { generateReport } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export default function GenerateReportButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateReport = async () => {
    setIsLoading(true)

    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.")
      }

      await generateReport(user.id)

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("리포트 생성 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleGenerateReport} disabled={isLoading}>
      {isLoading ? "생성 중..." : "리포트 생성"}
    </Button>
  )
}
