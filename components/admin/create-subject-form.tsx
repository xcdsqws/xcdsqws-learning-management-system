"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addSubject } from "@/lib/db"

export default function CreateSubjectForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // ID 형식 검증 (영문 소문자와 숫자만 허용)
      if (!/^[a-z0-9]+$/.test(formData.id)) {
        setError("ID는 영문 소문자와 숫자만 사용할 수 있습니다.")
        setIsLoading(false)
        return
      }

      await addSubject({
        id: formData.id,
        name: formData.name,
      })

      // 폼 초기화
      setFormData({
        id: "",
        name: "",
      })

      // 페이지 새로고침
      router.refresh()
    } catch (error: any) {
      console.error("과목 추가 오류:", error)
      setError(error.message || "과목을 추가하는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 과목 추가</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">과목 ID</Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="예: math, english, science"
              required
            />
            <p className="text-xs text-gray-500">영문 소문자와 숫자만 사용할 수 있습니다.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">과목명</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="예: 수학, 영어, 과학"
              required
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "추가 중..." : "과목 추가"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
