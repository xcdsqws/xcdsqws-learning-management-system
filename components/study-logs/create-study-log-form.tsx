"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addStudyLog } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface CreateStudyLogFormProps {
  subjects: Subject[]
}

export default function CreateStudyLogForm({ subjects }: CreateStudyLogFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject_id: "",
    duration: "",
    content: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.")
      }

      await addStudyLog({
        student_id: user.id,
        subject_id: formData.subject_id,
        duration: Number.parseInt(formData.duration),
        content: formData.content,
      })

      // 폼 초기화
      setFormData({
        subject_id: "",
        duration: "",
        content: "",
      })

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("학습 기록 추가 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 학습 기록 추가</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject_id">과목</Label>
            <Select
              value={formData.subject_id}
              onValueChange={(value) => handleSelectChange("subject_id", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="과목 선택" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">공부 시간 (분)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">학습 내용</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={4} required />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "추가 중..." : "학습 기록 추가"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
