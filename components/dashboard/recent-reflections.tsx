"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookMarked, PlusCircle } from "lucide-react"
import { getRecentReflections } from "@/lib/db"
import type { DailyReflection } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function RecentReflections() {
  const [reflections, setReflections] = useState<DailyReflection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const data = await getRecentReflections()
        setReflections(data)
        setIsLoading(false)
      } catch (error) {
        console.error("성찰 데이터를 불러오는 중 오류가 발생했습니다:", error)
        setIsLoading(false)
      }
    }

    fetchReflections()
  }, [])

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1:
        return "bg-red-100 text-red-800"
      case 2:
        return "bg-orange-100 text-orange-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
        return "bg-green-100 text-green-800"
      case 5:
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium">
          <div className="flex items-center">
            <BookMarked className="w-4 h-4 mr-2" />
            최근 학습 성찰
          </div>
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/reflections">모두 보기</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">데이터를 불러오는 중...</div>
        ) : reflections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookMarked className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>아직 성찰 기록이 없습니다.</p>
            <p className="text-sm">오늘의 학습을 기록해보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection) => (
              <div key={reflection.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">{formatDate(reflection.created_at)}</div>
                  <Badge className={getRatingColor(reflection.self_rating)}>{reflection.self_rating}점</Badge>
                </div>
                <p className="text-sm line-clamp-2">{reflection.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/reflections/new">
            <PlusCircle className="w-4 h-4 mr-2" />새 성찰 작성하기
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
