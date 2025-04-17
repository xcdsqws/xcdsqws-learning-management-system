"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { DailyReflection } from "@/lib/types"

interface ReflectionSummaryProps {
  reflections: DailyReflection[]
  period: "weekly" | "monthly" | "all"
}

export default function ReflectionSummary({ reflections, period = "all" }: ReflectionSummaryProps) {
  const [view, setView] = useState<"chart" | "list">("chart")

  // 날짜별로 그룹화
  const groupedByDate = reflections.reduce<Record<string, DailyReflection>>((acc, reflection) => {
    acc[reflection.reflection_date] = reflection
    return acc
  }, {})

  // 차트 데이터 준비
  const chartData = Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, reflection]) => ({
      date: date.split("-").slice(1).join("/"), // MM/DD 형식으로 변환
      rating: reflection.self_rating,
    }))

  // 평균 자기평가 점수
  const averageRating =
    reflections.length > 0
      ? Math.round((reflections.reduce((sum, r) => sum + r.self_rating, 0) / reflections.length) * 10) / 10
      : 0

  // 최고/최저 자기평가 날짜
  let highestRating = { date: "", rating: 0 }
  let lowestRating = { date: "", rating: 6 }

  reflections.forEach((r) => {
    if (r.self_rating > highestRating.rating) {
      highestRating = { date: r.reflection_date, rating: r.self_rating }
    }
    if (r.self_rating < lowestRating.rating) {
      lowestRating = { date: r.reflection_date, rating: r.self_rating }
    }
  })

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>학습 성찰 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(v) => setView(v as "chart" | "list")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chart">차트 보기</TabsTrigger>
            <TabsTrigger value="list">목록 보기</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            {chartData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {period === "weekly" ? "이번 주" : period === "monthly" ? "이번 달" : ""}
                {" 성찰 기록이 없습니다."}
              </div>
            ) : (
              <>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#8884d8"
                        name="자기평가"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">평균 자기평가</div>
                    <div className="text-2xl font-bold">{averageRating.toFixed(1)}점</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">최고 평가일</div>
                    <div className="text-2xl font-bold">{highestRating.rating}점</div>
                    <div className="text-xs text-gray-500">{formatDate(highestRating.date)}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">최저 평가일</div>
                    <div className="text-2xl font-bold">{lowestRating.rating}점</div>
                    <div className="text-xs text-gray-500">{formatDate(lowestRating.date)}</div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="list">
            {reflections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {period === "weekly" ? "이번 주" : period === "monthly" ? "이번 달" : ""}
                {" 성찰 기록이 없습니다."}
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {reflections.map((reflection) => (
                  <div key={reflection.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{formatDate(reflection.reflection_date)}</span>
                      <div className="flex items-center">
                        <span className="mr-1">자기평가:</span>
                        <span className="font-bold">{reflection.self_rating}점</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{reflection.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
