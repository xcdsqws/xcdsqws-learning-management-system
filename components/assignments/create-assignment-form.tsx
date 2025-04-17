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
import { addAssignment } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface CreateAssignmentFormProps {
  subjects: Subject[]
}

export default function CreateAssignmentForm({ subjects }: CreateAssignmentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    due_date: "",
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

      await addAssignment({
        student_id: user.id,
        title: formData.title,
        description: formData.description,
        subject_id: formData.subject_id,
        due_date: formData.due_date,
        status: "pending",
      })

      // 폼 초기화
      setFormData({
        title: "",
        description: "",
        subject_id: "",
        due_date: "",
      })

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("과제 추가 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 과제 추가</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

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
            <Label htmlFor="due_date">마감일</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "추가 중..." : "과제 추가"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
