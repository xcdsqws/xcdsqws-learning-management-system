import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Star } from "lucide-react"
import type { DailyReflection } from "@/lib/types"

interface ReflectionHistoryProps {
  reflections: DailyReflection[]
}

export default function ReflectionHistory({ reflections }: ReflectionHistoryProps) {
  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // 요일 구하기
  const getDayOfWeek = (dateString: string) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    const date = new Date(dateString)
    return days[date.getDay()]
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
    <Card>
      <CardHeader>
        <CardTitle>최근 성찰 기록</CardTitle>
      </CardHeader>
      <CardContent>
        {reflections.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">최근 30일간의 성찰 기록이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection) => (
              <div key={reflection.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span className="font-medium">{formatDate(reflection.reflection_date)}</span>
                    <Badge variant="outline" className="ml-2">
                      {getDayOfWeek(reflection.reflection_date)}요일
                    </Badge>
                  </div>
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
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {reflection.content.length > 100 ? `${reflection.content.substring(0, 100)}...` : reflection.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
