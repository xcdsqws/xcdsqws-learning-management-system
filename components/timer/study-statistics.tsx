"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { StudyStatistics, Subject } from "@/lib/types"

interface StudyStatisticsProps {
  statistics: StudyStatistics
  subjects: Subject[]
}

export default function StudyStatistics({ statistics, subjects }: StudyStatisticsProps) {
  // 과목별 학습 시간 데이터 준비
  const subjectTimeData = Object.entries(statistics.subjectTime).map(([subjectId, time]) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return {
      name: subject ? subject.name : subjectId,
      value: time,
    }
  })

  // 요일별 학습 시간 데이터 준비
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const dayOfWeekData = Object.entries(statistics.dayOfWeekDistribution).map(([day, time]) => ({
    name: dayNames[Number.parseInt(day)],
    value: time,
  }))

  // 시간대별 학습 시간 데이터 준비
  const hourlyData = Object.entries(statistics.hourlyDistribution)
    .map(([hour, time]) => ({
      name: `${hour}시`,
      value: time,
    }))
    .sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))

  // 차트 색상
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

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
          <CardTitle>학습 통계 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">총 학습 시간</div>
              <div className="text-2xl font-bold">{formatTime(statistics.totalTime)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">학습 일수</div>
              <div className="text-2xl font-bold">{Object.keys(statistics.dailyTime).length}일</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">일평균 학습 시간</div>
              <div className="text-2xl font-bold">
                {Object.keys(statistics.dailyTime).length > 0
                  ? formatTime(statistics.totalTime / Object.keys(statistics.dailyTime).length)
                  : "0분"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subject">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="subject">과목별</TabsTrigger>
          <TabsTrigger value="dayOfWeek">요일별</TabsTrigger>
          <TabsTrigger value="hourly">시간대별</TabsTrigger>
        </TabsList>

        <TabsContent value="subject">
          <Card>
            <CardHeader>
              <CardTitle>과목별 학습 시간</CardTitle>
            </CardHeader>
            <CardContent>
              {subjectTimeData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>아직 학습 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectTimeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {subjectTimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatTime(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 space-y-2">
                {subjectTimeData.map((subject, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{subject.name}</span>
                    </div>
                    <span>{formatTime(subject.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dayOfWeek">
          <Card>
            <CardHeader>
              <CardTitle>요일별 학습 시간</CardTitle>
            </CardHeader>
            <CardContent>
              {dayOfWeekData.every((day) => day.value === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>아직 학습 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dayOfWeekData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dayOfWeekData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatTime(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 space-y-2">
                {dayOfWeekData.map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{day.name}요일</span>
                    </div>
                    <span>{formatTime(day.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle>시간대별 학습 시간</CardTitle>
            </CardHeader>
            <CardContent>
              {hourlyData.every((hour) => hour.value === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>아직 학습 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hourlyData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {hourlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatTime(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
