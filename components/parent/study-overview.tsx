"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { StudyStatistics } from "@/lib/types"

interface ParentStudyOverviewProps {
  statistics: StudyStatistics
}

export default function ParentStudyOverview({ statistics }: ParentStudyOverviewProps) {
  // 과목별 학습 시간 데이터 준비
  const subjectTimeData = Object.entries(statistics.subjectTime).map(([subjectId, time]) => ({
    name: subjectId,
    value: time,
  }))

  // 시간 형식 변환 (분 -> 시간:분)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  // 차트 색상
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>학습 시간 개요</CardTitle>
      </CardHeader>
      <CardContent>
        {subjectTimeData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            아직 등록된 학습 기록이 없습니다.
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
        <div className="mt-4 text-sm">
          <p>
            <strong>총 학습 시간:</strong> {formatTime(statistics.totalTime)}
          </p>
          <p>
            <strong>학습 일수:</strong> {Object.keys(statistics.dailyTime).length}일
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
