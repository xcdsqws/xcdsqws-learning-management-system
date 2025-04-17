"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { createAdminAccount } from "@/lib/account"

export default function CreateAdminScript() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    id: "admin",
    password: "",
    name: "관리자",
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
      const result = await createAdminAccount(formData)
      setSuccess(`관리자 계정이 성공적으로 생성되었습니다. 아이디: ${result.id}`)
    } catch (err: any) {
      setError(err.message || "관리자 계정 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>관리자 계정 생성</CardTitle>
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
              <Label htmlFor="id">아이디</Label>
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
                type="text"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "생성 중..." : "관리자 계정 생성"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
