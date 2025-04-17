"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addParentAccount } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"

interface AddParentFormProps {
  students: User[]
}

export default function AddParentForm({ students }: AddParentFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    child_id: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!formData.id || !formData.password || !formData.name || !formData.child_id) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addParentAccount({
        ...formData,
        role: "parent",
      })

      toast({
        title: "학부모 계정 추가 완료",
        description: "학부모 계정이 성공적으로 추가되었습니다.",
      })

      // 폼 초기화
      setFormData({
        id: "",
        password: "",
        name: "",
        child_id: "",
      })
      setConfirmPassword("")

      // 페이지 새로고침
      router.refresh()
    } catch (error) {
      console.error("학부모 계정 추가 오류:", error)
      toast({
        title: "계정 추가 실패",
        description: "학부모 계정을 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="child_id">자녀 선택</Label>
        <Select value={formData.child_id} onValueChange={(value) => setFormData({ ...formData, child_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="자녀 선택" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} ({student.grade}학년 {student.class}반 {student.number}번)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="id">아이디</Label>
        <Input id="id" name="id" value={formData.id} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "처리 중..." : "학부모 계정 추가"}
      </Button>
    </form>
  )
}
