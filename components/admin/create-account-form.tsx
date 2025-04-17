"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAccount } from "@/lib/account"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface CreateAccountFormProps {
  onAccountCreated?: () => void
}

export default function CreateAccountForm({ onAccountCreated }: CreateAccountFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    grade: "",
    class: "",
    number: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      // 학년, 반, 번호를 숫자로 변환
      const accountData = {
        ...formData,
        grade: formData.grade ? Number.parseInt(formData.grade) : undefined,
        class: formData.class ? Number.parseInt(formData.class) : undefined,
        number: formData.number ? Number.parseInt(formData.number) : undefined,
      }

      const result = await createAccount(accountData)

      setSuccess(`계정이 성공적으로 생성되었습니다. 아이디: ${result.id}`)
      setFormData({
        id: "",
        password: "",
        name: "",
        grade: "",
        class: "",
        number: "",
      })

      if (onAccountCreated) {
        onAccountCreated()
      }
    } catch (err: any) {
      setError(err.message || "계정 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const generateRandomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, id: result }))
  }

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let result = ""
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, password: result }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>학생 계정 생성</CardTitle>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="id">아이디</Label>
              <Button type="button" variant="outline" size="sm" onClick={generateRandomId}>
                무작위 생성
              </Button>
            </div>
            <Input id="id" name="id" value={formData.id} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">비밀번호</Label>
              <Button type="button" variant="outline" size="sm" onClick={generateRandomPassword}>
                무작위 생성
              </Button>
            </div>
            <Input
              id="password"
              name="password"
              type="text" // 관리자가 볼 수 있도록 text로 설정
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">학년</Label>
              <Input
                id="grade"
                name="grade"
                type="number"
                min="1"
                value={formData.grade}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">반</Label>
              <Input
                id="class"
                name="class"
                type="number"
                min="1"
                value={formData.class}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">번호</Label>
              <Input
                id="number"
                name="number"
                type="number"
                min="1"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "생성 중..." : "계정 생성"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
