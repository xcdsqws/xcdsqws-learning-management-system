"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download } from "lucide-react"

export default function ExportDataForm() {
  const [selectedData, setSelectedData] = useState({
    users: true,
    subjects: true,
    assignments: true,
    grades: true,
    studyLogs: true,
    studyGoals: true,
  })
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    // 선택된 데이터가 없는 경우
    if (!Object.values(selectedData).some((v) => v)) {
      toast({
        title: "선택 오류",
        description: "내보낼 데이터를 하나 이상 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      // 서버에 데이터 내보내기 요청
      const response = await fetch("/api/admin/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedData),
      })

      if (!response.ok) {
        throw new Error("데이터 내보내기 실패")
      }

      // 파일 다운로드
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `lms-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "내보내기 완료",
        description: "데이터가 성공적으로 내보내졌습니다.",
      })
    } catch (error) {
      console.error("데이터 내보내기 오류:", error)
      toast({
        title: "내보내기 실패",
        description: "데이터를 내보내는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleCheckboxChange = (key: keyof typeof selectedData) => {
    setSelectedData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="users" checked={selectedData.users} onCheckedChange={() => handleCheckboxChange("users")} />
          <Label htmlFor="users">사용자 데이터</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="subjects"
            checked={selectedData.subjects}
            onCheckedChange={() => handleCheckboxChange("subjects")}
          />
          <Label htmlFor="subjects">과목 데이터</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="assignments"
            checked={selectedData.assignments}
            onCheckedChange={() => handleCheckboxChange("assignments")}
          />
          <Label htmlFor="assignments">과제 데이터</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="grades" checked={selectedData.grades} onCheckedChange={() => handleCheckboxChange("grades")} />
          <Label htmlFor="grades">성적 데이터</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="studyLogs"
            checked={selectedData.studyLogs}
            onCheckedChange={() => handleCheckboxChange("studyLogs")}
          />
          <Label htmlFor="studyLogs">학습 로그 데이터</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="studyGoals"
            checked={selectedData.studyGoals}
            onCheckedChange={() => handleCheckboxChange("studyGoals")}
          />
          <Label htmlFor="studyGoals">학습 목표 데이터</Label>
        </div>
      </div>

      <Button onClick={handleExport} disabled={isExporting} className="w-full">
        {isExporting ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            내보내는 중...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            CSV로 내보내기
          </>
        )}
      </Button>

      <div className="text-sm text-muted-foreground">
        <p>선택한 데이터를 CSV 형식으로 내보냅니다.</p>
        <p>내보낸 파일은 백업 또는 다른 시스템으로 이전할 때 사용할 수 있습니다.</p>
      </div>
    </div>
  )
}
