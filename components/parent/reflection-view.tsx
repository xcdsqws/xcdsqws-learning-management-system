"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Star } from "lucide-react"
import type { DailyReflection } from "@/lib/types"

interface ParentReflectionViewProps {
  reflections: DailyReflection[]
}

export default function ParentReflectionView({ reflections }: ParentReflectionViewProps) {
  const [view, setView] = useState<"chart" | "list">("chart")
  const [period, setPeriod] = useState<"week" | "month" | "all">("all")

  // 기간에 따라 필터링
  const filteredReflections = reflections.filter((reflection) => {
    if (period === "all") return true

    const reflectionDate = new Date(reflection.reflection_date)
    const now = new Date()

    if (period === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return reflectionDate >= weekAgo
    }

    if (period === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return reflectionDate >= monthAgo
    }

    return true
  })

  // 날짜별로 그룹화
  const groupedByDate = filteredReflections.reduce<Record<string, DailyReflection>>((acc, reflection) => {
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
    filteredReflections.length > 0
      ? Math.round((filteredReflections.reduce((sum, r) => sum + r.self_rating, 0) / filteredReflections.length) * 10) /
        10
      : 0

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // 평점에 따른 별 색상
  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 5:
        return "text-yellow-500"
      case 4:
        return "text-yellow-400"
      case 3:
        return "text-yellow-300"
      case 2:
        return "text-gray-400"
      case 1:
        return "text-gray-300"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle>학습 성찰 기록</CardTitle>
            <div className="mt-2 md:mt-0">
              <Select value={period} onValueChange={(value) => setPeriod(value as "week" | "month" | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">최근 1주</SelectItem>
                  <SelectItem value="month">최근 1개월</SelectItem>
                  <SelectItem value="all">전체 기간</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                  {period === "week" ? "이번 주" : period === "month" ? "이번 달" : ""}
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

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">자녀의 학습 성찰 분석</h3>
                    <p className="mb-2">
                      자녀의 평균 자기평가 점수는 <strong>{averageRating.toFixed(1)}점</strong>입니다.
                      {averageRating >= 4
                        ? " 자녀가 자신의 학습에 대해 긍정적으로 평가하고 있습니다."
                        : averageRating >= 3
                          ? " 자녀가 자신의 학습에 대해 보통 수준으로 평가하고 있습니다."
                          : " 자녀가 자신의 학습에 어려움을 느끼고 있을 수 있습니다. 대화를 통해 도움을 주세요."}
                    </p>
                    <p>
                      정기적인 성찰은 자기주도 학습 능력을 향상시키는 데 도움이 됩니다. 자녀와 함께 학습 계획을 세우고
                      실천해보세요.
                    </p>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="list">
              {filteredReflections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {period === "week" ? "이번 주" : period === "month" ? "이번 달" : ""}
                  {" 성찰 기록이 없습니다."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReflections.map((reflection) => (
                    <div key={reflection.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{formatDate(reflection.reflection_date)}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < reflection.self_rating ? getRatingColor(reflection.self_rating) : "text-gray-200"
                              }`}
                              fill={i < reflection.self_rating ? "currentColor" : "none"}
                            />
                          ))}
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
    </div>
  )
}
