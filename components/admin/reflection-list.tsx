"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllReflections, getStudentById } from "@/lib/db"
import type { DailyReflection, Student } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function ReflectionList() {
  const [reflections, setReflections] = useState<(DailyReflection & { student: Student })[]>([])
  const [filteredReflections, setFilteredReflections] = useState<(DailyReflection & { student: Student })[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const allReflections = await getAllReflections()

        // 각 성찰에 대한 학생 정보 가져오기
        const reflectionsWithStudents = await Promise.all(
          allReflections.map(async (reflection) => {
            const student = await getStudentById(reflection.student_id)
            return { ...reflection, student: student || ({ name: "Unknown" } as Student) }
          }),
        )

        setReflections(reflectionsWithStudents)
        setFilteredReflections(reflectionsWithStudents)
        setIsLoading(false)
      } catch (error) {
        console.error("성찰 데이터를 불러오는 중 오류가 발생했습니다:", error)
        setIsLoading(false)
      }
    }

    fetchReflections()
  }, [])

  useEffect(() => {
    // 검색어와 평점 필터 적용
    let filtered = reflections

    if (searchTerm) {
      filtered = filtered.filter(
        (reflection) =>
          reflection.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reflection.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter((reflection) => reflection.self_rating === Number.parseInt(ratingFilter))
    }

    setFilteredReflections(filtered)
  }, [searchTerm, ratingFilter, reflections])

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

  if (isLoading) {
    return <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="학생 이름 또는 내용으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="평점 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 평점</SelectItem>
                <SelectItem value="1">1점</SelectItem>
                <SelectItem value="2">2점</SelectItem>
                <SelectItem value="3">3점</SelectItem>
                <SelectItem value="4">4점</SelectItem>
                <SelectItem value="5">5점</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredReflections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">검색 조건에 맞는 성찰 기록이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>학생</TableHead>
                  <TableHead>자기평가</TableHead>
                  <TableHead className="hidden md:table-cell">내용 미리보기</TableHead>
                  <TableHead>상세보기</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReflections.map((reflection) => (
                  <TableRow key={reflection.id}>
                    <TableCell>{formatDate(reflection.created_at)}</TableCell>
                    <TableCell>{reflection.student?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge className={getRatingColor(reflection.self_rating)}>{reflection.self_rating}점</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {reflection.content.substring(0, 50)}
                      {reflection.content.length > 50 ? "..." : ""}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            상세보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {reflection.student?.name || "Unknown"}의 성찰 - {formatDate(reflection.created_at)}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <div className="flex items-center mb-4">
                              <span className="font-medium mr-2">자기평가:</span>
                              <Badge className={getRatingColor(reflection.self_rating)}>
                                {reflection.self_rating}점
                              </Badge>
                            </div>
                            <div className="mb-4">
                              <span className="font-medium block mb-2">학습 내용:</span>
                              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{reflection.content}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
