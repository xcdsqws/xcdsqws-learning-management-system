"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import type { Grade } from "@/lib/types"

interface ParentGradeOverviewProps {
  grades: Grade[]
}

export default function ParentGradeOverview({ grades }: ParentGradeOverviewProps) {
  // 최근 성적 데이터 준비
  const recentGrades = [...grades]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
    .map((grade) => ({
      name: grade.test_name,
      score: Math.round((grade.score / grade.max_score) * 100),
    }))
    .reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 성적</CardTitle>
      </CardHeader>
      <CardContent>
        {grades.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            아직 등록된 성적이 없습니다.
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer
              config={{
                score: {
                  label: "점수",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentGrades} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="score" fill="var(--color-score)" name="점수" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
        <div className="mt-4 text-sm">
          <p>
            <strong>평균 점수:</strong>{" "}
            {grades.length > 0
              ? `${Math.round(
                  grades.reduce((sum, grade) => sum + (grade.score / grade.max_score) * 100, 0) / grades.length,
                )}점`
              : "데이터 없음"}
          </p>
          <p>
            <strong>최고 점수:</strong>{" "}
            {grades.length > 0
              ? `${Math.round(Math.max(...grades.map((grade) => (grade.score / grade.max_score) * 100)))}점`
              : "데이터 없음"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
