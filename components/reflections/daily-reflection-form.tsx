"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { addDailyReflection, getReflectionByDate } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CalendarIcon, Save } from "lucide-react"
import type { DailyReflection } from "@/lib/types"

export default function DailyReflectionForm() {
  const [content, setContent] = useState("")
  const [rating, setRating] = useState<string>("3")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingReflection, setExistingReflection] = useState<DailyReflection | null>(null)
  const [today] = useState(new Date().toISOString().split("T")[0])

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkExistingReflection = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        const reflection = await getReflectionByDate(user.id, today)
        if (reflection) {
          setExistingReflection(reflection)
          setContent(reflection.content)
          setRating(reflection.self_rating.toString())
        }
      } catch (error) {
        console.error("기존 성찰 조회 오류:", error)
      }
    }

    checkExistingReflection()
  }, [today])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "내용을 입력하세요",
        description: "오늘의 학습 성찰 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.")
      }

      await addDailyReflection({
        student_id: user.id,
        reflection_date: today,
        content,
        self_rating: Number.parseInt(rating),
      })

      toast({
        title: "성찰 저장 완료",
        description: "오늘의 학습 성찰이 저장되었습니다.",
      })

      router.refresh()
    } catch (error) {
      console.error("학습 성찰 저장 오류:", error)
      toast({
        title: "저장 실패",
        description: "학습 성찰을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          오늘의 학습 성찰
          <span className="ml-2 text-sm font-normal text-muted-foreground">({today})</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reflection">오늘의 학습 내용 및 성찰</Label>
            <Textarea
              id="reflection"
              placeholder="오늘 공부한 내용, 어려웠던 점, 배운 점 등을 자유롭게 작성해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>오늘의 학습 자기평가</Label>
            <RadioGroup value={rating} onValueChange={setRating} className="flex justify-between">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center space-y-1">
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`rating-${value}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer"
                  >
                    {value}
                  </Label>
                  <span className="text-xs">
                    {value === 1 && "매우 부족"}
                    {value === 2 && "부족"}
                    {value === 3 && "보통"}
                    {value === 4 && "좋음"}
                    {value === 5 && "매우 좋음"}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {existingReflection ? "성찰 수정하기" : "성찰 저장하기"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
