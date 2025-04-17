"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Subject, User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addGrade } from "@/lib/db"

interface AdminCreateGradeFormProps {
  students: User[]
  subjects: Subject[]
}

export default function AdminCreateGradeForm({ students, subjects }: AdminCreateGradeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_id: "",
    test_name: "",
    subject_id: "",
    score: "",
    max_score: "100",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await addGrade({
        student_id: formData.student_id,
        test_name: formData.test_name,
        subject_id: formData.subject_id,
        score: Number.parseInt(formData.score),
        max_score: Number.parseInt(formData.max_score),
      })

      // 폼 초기화
      setFormData({
        student_id: "",
        test_name: "",
        subject_id: "",
        score: "",
        max_score: "100",
      })

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("성적 추가 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 성적 추가</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">학생</Label>
            <Select
              value={formData.student_id}
              onValueChange={(value) => handleSelectChange("student_id", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="학생 선택" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.grade}학년 {student.class}반 {student.number}번 {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test_name">시험명</Label>
            <Input
              id="test_name"
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
              placeholder="예: 중간고사, 기말고사"
              required
            />
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
            <Label htmlFor="score">점수</Label>
            <Input
              id="score"
              name="score"
              type="number"
              min="0"
              max={formData.max_score}
              value={formData.score}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_score">만점</Label>
            <Input
              id="max_score"
              name="max_score"
              type="number"
              min="1"
              value={formData.max_score}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "추가 중..." : "성적 추가"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
