"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Upload, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ImportDataForm() {
  const [importType, setImportType] = useState<"users" | "subjects" | "grades">("users")
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "파일 선택 오류",
        description: "가져올 CSV 파일을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", importType)

      // 서버에 데이터 가져오기 요청
      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "데이터 가져오기 실패")
      }

      const result = await response.json()

      toast({
        title: "가져오기 완료",
        description: `${result.count}개의 ${getImportTypeText(importType)}이(가) 성공적으로 가져와졌습니다.`,
      })

      // 폼 초기화
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("데이터 가져오기 오류:", error)
      toast({
        title: "가져오기 실패",
        description: error instanceof Error ? error.message : "데이터를 가져오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const getImportTypeText = (type: string) => {
    switch (type) {
      case "users":
        return "사용자 데이터"
      case "subjects":
        return "과목 데이터"
      case "grades":
        return "성적 데이터"
      default:
        return "데이터"
    }
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={importType} onValueChange={(value) => setImportType(value as any)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="users" id="users" />
          <Label htmlFor="users">사용자 데이터</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="subjects" id="subjects" />
          <Label htmlFor="subjects">과목 데이터</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="grades" id="grades" />
          <Label htmlFor="grades">성적 데이터</Label>
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="file">CSV 파일 선택</Label>
        <input
          ref={fileInputRef}
          id="file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
        />
      </div>

      <Button onClick={handleImport} disabled={isImporting || !file} className="w-full">
        {isImporting ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            가져오는 중...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            데이터 가져오기
          </>
        )}
      </Button>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>주의</AlertTitle>
        <AlertDescription>
          <p>데이터 가져오기는 기존 데이터와 충돌할 수 있습니다.</p>
          <p>가져오기 전에 반드시 데이터를 백업하세요.</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
