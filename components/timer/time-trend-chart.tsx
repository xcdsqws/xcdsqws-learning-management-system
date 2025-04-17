"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import type { StudyStatistics, Subject } from "@/lib/types"

interface TimeTrendChartProps {
  statistics: StudyStatistics
  subjects: Subject[]
}

export default function TimeTrendChart({ statistics, subjects }: TimeTrendChartProps) {
  // 일별 학습 시간 데이터 준비
  const dailyData = Object.entries(statistics.dailyTime || {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14) // 최근 14일
    .map(([date, time]) => ({
      date: date.split("-").slice(1).join("/"), // YYYY-MM-DD -> MM/DD
      time: Math.round((time / 60) * 10) / 10, // 분 -> 시간 변환 (소수점 1자리)
    }))

  // 주별 학습 시간 데이터 준비
  const weeklyData = Object.entries(statistics.weeklyTime || {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-10) // 최근 10주
    .map(([week, time]) => {
      const [year, weekNum] = week.split("-")
      return {
        week: `${year}-${weekNum}주차`,
        time: Math.round((time / 60) * 10) / 10, // 분 -> 시간 변환 (소수점 1자리)
      }
    })

  // 월별 학습 시간 데이터 준비
  const monthlyData = Object.entries(statistics.monthlyTime || {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12) // 최근 12개월
    .map(([month, time]) => {
      const [year, monthNum] = month.split("-")
      return {
        month: `${year}-${monthNum}`,
        time: Math.round((time / 60) * 10) / 10, // 분 -> 시간 변환 (소수점 1자리)
      }
    })

  // 과목별 일별 학습 시간 데이터 준비
  const subjectDailyData = dailyData.map((day) => {
    const result: Record<string, any> = { date: day.date }

    // 각 과목별 해당 날짜의 학습 시간 추가
    subjects.forEach((subject) => {
      const dailyKey = Object.keys(statistics.dailyTime).find((key) => key.split("-").slice(1).join("/") === day.date)
      if (dailyKey) {
        // 해당 날짜의 해당 과목 학습 시간
        const subjectTime = statistics.subjectTime[subject.id] || 0
        result[subject.name] = Math.round((subjectTime / 60) * 10) / 10 // 분 -> 시간 변환 (소수점 1자리)
      } else {
        result[subject.name] = 0
      }
    })

    return result
  })

  // 차트 색상
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="daily">일별</TabsTrigger>
          <TabsTrigger value="weekly">주별</TabsTrigger>
          <TabsTrigger value="monthly">월별</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>일별 학습 시간 추이</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>아직 학습 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: "시간", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${value} 시간`, "학습 시간"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="time"
                        stroke="#8884d8"
                        name="학습 시간 (시간)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 text-sm">
                <p>
                  <strong>평균 학습 시간:</strong>{" "}
                  {dailyData.length > 0
                    ? `${(dailyData.reduce((sum, day) => sum + day.time, 0) / dailyData.length).toFixed(1)} 시간/일`
                    : "데이터 없음"}
                </p>
                <p>
                  <strong>최대 학습일:</strong>{" "}
                  {dailyData.length > 0
                    ? `${dailyData.reduce((max, day) => (day.time > max.time ? day : max), dailyData[0]).date} (${
                        dailyData.reduce((max, day) => (day.time > max.time ? day : max), dailyData[0]).time
                      } 시간)`
                    : "데이터 없음"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>주별 학습 시간 추이</CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>아직 학습 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis label={{ value: "시간", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${value} 시간`, "학습 시간"]} />
                      <Legend />
                      <Bar dataKey="time" fill="#8884d8" name="학습 시간 (시간)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 text-sm">
                <p>
                  <strong>주간 평균 학습 시간:</strong>{" "}
                  {weeklyData.length > 0
                    ? `${(weeklyData.reduce((sum, week) => sum + week.time, 0) / weeklyData.length).toFixed(1)} 시간/주`
                    : "데이터 없음"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>월별 학습 시간 추이</CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>아직 학습 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: "시간", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`${value} 시간`, "학습 시간"]} />
                      <Legend />
                      <Bar dataKey="time" fill="#8884d8" name="학습 시간 (시간)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 text-sm">
                <p>
                  <strong>월간 평균 학습 시간:</strong>{" "}
                  {monthlyData.length > 0
                    ? `${(monthlyData.reduce((sum, month) => sum + month.time, 0) / monthlyData.length).toFixed(1)} 시간/월`
                    : "데이터 없음"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>과목별 학습 시간 추이</CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 || dailyData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>아직 학습 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={subjectDailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: "시간", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  {subjects.map((subject, index) => (
                    <Line
                      key={subject.id}
                      type="monotone"
                      dataKey={subject.name}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
