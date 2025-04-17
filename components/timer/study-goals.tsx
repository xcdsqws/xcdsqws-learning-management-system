"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { upsertStudyGoal, deleteStudyGoal } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Target } from "lucide-react"
import type { StudyGoal, Subject, StudyStatistics } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface StudyGoalsProps {
  goals: StudyGoal[]
  subjects: Subject[]
  statistics: StudyStatistics
}

export default function StudyGoals({ goals, subjects, statistics }: StudyGoalsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [targetMinutes, setTargetMinutes] = useState("60")
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  // 학습 목표 추가/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSubject) {
      toast({
        title: "과목을 선택하세요",
        variant: "destructive",
      })
      return
    }

    const minutes = Number.parseInt(targetMinutes)
    if (isNaN(minutes) || minutes <= 0) {
      toast({
        title: "유효한 목표 시간을 입력하세요",
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

      await upsertStudyGoal({
        student_id: user.id,
        subject_id: selectedSubject,
        target_minutes: minutes,
        period,
      })

      toast({
        title: "학습 목표 저장 완료",
        description: "학습 목표가 성공적으로 저장되었습니다.",
      })

      // 폼 초기화 및 목록 새로고침
      setIsAdding(false)
      setSelectedSubject("")
      setTargetMinutes("60")
      setPeriod("daily")
      router.refresh()
    } catch (error) {
      console.error("학습 목표 저장 오류:", error)
      toast({
        title: "저장 실패",
        description: "학습 목표를 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 학습 목표 삭제
  const handleDelete = async (id: string) => {
    setDeletingId(id)

    try {
      await deleteStudyGoal(id)
      toast({
        title: "학습 목표 삭제 완료",
        description: "학습 목표가 성공적으로 삭제되었습니다.",
      })
      router.refresh()
    } catch (error) {
      console.error("학습 목표 삭제 오류:", error)
      toast({
        title: "삭제 실패",
        description: "학습 목표를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  // 과목 ID로 과목명 찾기
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : subjectId
  }

  // 기간 텍스트 변환
  const getPeriodText = (periodValue: string) => {
    switch (periodValue) {
      case "daily":
        return "일일"
      case "weekly":
        return "주간"
      case "monthly":
        return "월간"
      default:
        return periodValue
    }
  }

  // 목표 달성률 계산
  const calculateProgress = (goal: StudyGoal) => {
    let studyTime = 0

    // 기간에 따른 학습 시간 계산
    if (goal.period === "daily") {
      // 오늘 날짜
      const today = new Date().toISOString().split("T")[0]
      studyTime = statistics.dailyTime[today] || 0
    } else if (goal.period === "weekly") {
      // 이번 주
      const now = new Date()
      const weekNumber = getWeekNumber(now)
      const weeklyKey = `${now.getFullYear()}-${weekNumber.toString().padStart(2, "0")}`
      studyTime = statistics.weeklyTime[weeklyKey] || 0
    } else if (goal.period === "monthly") {
      // 이번 달
      const now = new Date()
      const monthlyKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`
      studyTime = statistics.monthlyTime[monthlyKey] || 0
    }

    // 해당 과목의 학습 시간만 필터링
    const subjectTime = goal.subject_id === "all" ? studyTime : statistics.subjectTime[goal.subject_id] || 0

    // 달성률 계산 (최대 100%)
    return Math.min(100, Math.round((subjectTime / goal.target_minutes) * 100))
  }

  // 주차 계산 함수
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // 시간 형식 변환 (분 -> 시간:분)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>학습 목표</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? "취소" : <Plus className="mr-2 h-4 w-4" />}
              {isAdding ? "취소" : "목표 추가"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">과목 선택</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
                <Label htmlFor="targetMinutes">목표 시간 (분)</Label>
                <Input
                  id="targetMinutes"
                  type="number"
                  min="1"
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>목표 기간</Label>
                <RadioGroup
                  value={period}
                  onValueChange={(value) => setPeriod(value as "daily" | "weekly" | "monthly")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">일일</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">주간</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">월간</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "학습 목표 저장"}
              </Button>
            </form>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>설정된 학습 목표가 없습니다.</p>
              <p className="text-sm">위의 '목표 추가' 버튼을 클릭하여 학습 목표를 설정하세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = calculateProgress(goal)
                return (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{getSubjectName(goal.subject_id)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getPeriodText(goal.period)} 목표: {formatTime(goal.target_minutes)}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>학습 목표 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              정말로 이 학습 목표를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(goal.id)}>삭제</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>진행률: {progress}%</span>
                        <span>
                          {formatTime(
                            Math.min(
                              goal.target_minutes,
                              goal.subject_id === "all"
                                ? statistics.totalTime
                                : statistics.subjectTime[goal.subject_id] || 0,
                            ),
                          )}{" "}
                          / {formatTime(goal.target_minutes)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
