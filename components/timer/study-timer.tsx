"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addStudyLog } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Play, Pause, RotateCcw, Save, Settings } from "lucide-react"
import type { Subject } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

interface StudyTimerProps {
  subjects: Subject[]
}

export default function StudyTimer({ subjects }: StudyTimerProps) {
  // 타이머 상태
  const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 기본 25분 (초 단위)
  const [isRunning, setIsRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [totalStudyTime, setTotalStudyTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 학습 기록 상태
  const [selectedSubject, setSelectedSubject] = useState("")
  const [studyContent, setStudyContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // 타이머 설정
  const [timerSettings, setTimerSettings] = useState({
    pomodoro: 25,
    short: 5,
    long: 15,
  })

  const { toast } = useToast()

  // 타이머 모드에 따른 시간 설정
  const timerModes = {
    pomodoro: timerSettings.pomodoro * 60, // 기본 25분
    short: timerSettings.short * 60, // 기본 5분
    long: timerSettings.long * 60, // 기본 15분
  }

  // 타이머 모드 변경 시 시간 재설정
  useEffect(() => {
    resetTimer()
  }, [mode])

  // 타이머 시작/정지
  const toggleTimer = () => {
    if (isRunning) {
      stopTimer()
    } else {
      if (!selectedSubject) {
        toast({
          title: "과목을 선택하세요",
          description: "타이머를 시작하기 전에 과목을 선택해주세요.",
          variant: "destructive",
        })
        return
      }
      startTimer()
    }
  }

  // 타이머 시작
  const startTimer = () => {
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete()
          return 0
        }
        return prev - 1
      })

      // 공부 모드일 때만 총 공부 시간 증가
      if (mode === "pomodoro") {
        setTotalStudyTime((prev) => prev + 1)
      }
    }, 1000)
  }

  // 타이머 정지
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }

  // 타이머 리셋
  const resetTimer = () => {
    stopTimer()
    setTimeLeft(timerModes[mode])
  }

  // 타이머 완료 처리
  const handleTimerComplete = () => {
    stopTimer()

    // 알림음 재생
    const audio = new Audio("/notification.mp3")
    audio.play().catch((e) => console.error("알림음 재생 실패:", e))

    // 모드에 따른 처리
    if (mode === "pomodoro") {
      // 뽀모도로 완료 시 사이클 증가
      setCycles((prev) => prev + 1)

      // 4사이클마다 긴 휴식, 그 외에는 짧은 휴식
      const nextMode = cycles % 4 === 3 ? "long" : "short"
      setMode(nextMode)

      toast({
        title: "학습 세션 완료!",
        description: nextMode === "long" ? "긴 휴식 시간입니다." : "짧은 휴식 시간입니다.",
      })
    } else {
      // 휴식 완료 시 다시 뽀모도로 모드로
      setMode("pomodoro")
      toast({
        title: "휴식 시간 완료!",
        description: "다시 학습을 시작하세요.",
      })
    }
  }

  // 학습 기록 저장
  const saveStudyLog = async () => {
    if (!selectedSubject) {
      toast({
        title: "과목을 선택하세요",
        variant: "destructive",
      })
      return
    }

    if (totalStudyTime < 60) {
      // 최소 1분 이상
      toast({
        title: "학습 시간이 너무 짧습니다",
        description: "최소 1분 이상 학습해야 기록할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.")
      }

      // 초 단위를 분 단위로 변환
      const durationMinutes = Math.floor(totalStudyTime / 60)

      await addStudyLog({
        student_id: user.id,
        subject_id: selectedSubject,
        duration: durationMinutes,
        content: studyContent || `${durationMinutes}분 학습 완료`,
      })

      toast({
        title: "학습 기록 저장 완료",
        description: `${durationMinutes}분의 학습 기록이 저장되었습니다.`,
      })

      // 초기화
      setTotalStudyTime(0)
      setStudyContent("")
      setCycles(0)
    } catch (error) {
      console.error("학습 기록 저장 오류:", error)
      toast({
        title: "저장 실패",
        description: "학습 기록을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 타이머 설정 변경
  const handleSettingsChange = (setting: keyof typeof timerSettings, value: number) => {
    setTimerSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  // 시간 형식 변환 (초 -> MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // 총 학습 시간 형식 변환 (초 -> HH:MM:SS)
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}시간 ${mins}분 ${secs}초`
    } else if (mins > 0) {
      return `${mins}분 ${secs}초`
    } else {
      return `${secs}초`
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-center">학습 타이머</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>타이머 설정</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>학습 시간 (분): {timerSettings.pomodoro}</Label>
                  <Slider
                    value={[timerSettings.pomodoro]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => handleSettingsChange("pomodoro", value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>짧은 휴식 (분): {timerSettings.short}</Label>
                  <Slider
                    value={[timerSettings.short]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={(value) => handleSettingsChange("short", value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>긴 휴식 (분): {timerSettings.long}</Label>
                  <Slider
                    value={[timerSettings.long]}
                    min={5}
                    max={30}
                    step={5}
                    onValueChange={(value) => handleSettingsChange("long", value[0])}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>저장</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

            <Tabs value={mode} onValueChange={(value) => setMode(value as "pomodoro" | "short" | "long")}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="pomodoro">학습 ({timerSettings.pomodoro}분)</TabsTrigger>
                <TabsTrigger value="short">짧은 휴식 ({timerSettings.short}분)</TabsTrigger>
                <TabsTrigger value="long">긴 휴식 ({timerSettings.long}분)</TabsTrigger>
              </TabsList>

              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold my-8 font-mono">{formatTime(timeLeft)}</div>

                <div className="flex gap-4 mb-6">
                  <Button
                    size="lg"
                    onClick={toggleTimer}
                    className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isRunning ? "일시정지" : "시작"}
                  </Button>

                  <Button size="lg" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="mr-2" />
                    리셋
                  </Button>
                </div>

                <div className="text-center space-y-2">
                  <p>완료한 학습 세션: {cycles}회</p>
                  <p>총 학습 시간: {formatTotalTime(totalStudyTime)}</p>
                </div>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>학습 기록 저장</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">학습 내용</Label>
              <Input
                id="content"
                value={studyContent}
                onChange={(e) => setStudyContent(e.target.value)}
                placeholder="학습한 내용을 간략히 적어주세요"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={saveStudyLog} disabled={isSaving || totalStudyTime < 60}>
            <Save className="mr-2" />
            {isSaving ? "저장 중..." : "학습 기록 저장"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
