import { checkAuth } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard/header"
import { getSubjects, getStudyGoalsByStudent, getStudyStatistics } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudyTimer from "@/components/timer/study-timer"
import StudyStatistics from "@/components/timer/study-statistics"
import StudyGoals from "@/components/timer/study-goals"
import TimeTrendChart from "@/components/timer/time-trend-chart"
import PatternAnalysis from "@/components/timer/pattern-analysis"

export default async function TimerPage() {
  const user = await checkAuth()
  const subjects = await getSubjects()
  const goals = await getStudyGoalsByStudent(user.id)
  const statistics = await getStudyStatistics(user.id, 30) // 최근 30일 통계

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">학습 타이머 및 통계</h1>

        <Tabs defaultValue="timer" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="timer">타이머</TabsTrigger>
            <TabsTrigger value="statistics">학습 통계</TabsTrigger>
            <TabsTrigger value="goals">학습 목표</TabsTrigger>
            <TabsTrigger value="trends">시간 추이</TabsTrigger>
            <TabsTrigger value="patterns">학습 패턴</TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="max-w-md mx-auto">
            <StudyTimer subjects={subjects} />
          </TabsContent>

          <TabsContent value="statistics">
            <StudyStatistics statistics={statistics} subjects={subjects} />
          </TabsContent>

          <TabsContent value="goals">
            <StudyGoals goals={goals} subjects={subjects} statistics={statistics} />
          </TabsContent>

          <TabsContent value="trends">
            <TimeTrendChart statistics={statistics} subjects={subjects} />
          </TabsContent>

          <TabsContent value="patterns">
            <PatternAnalysis statistics={statistics} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
