"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Assignment } from "@/lib/types"
import { Calendar, Clock } from "lucide-react"

interface ParentAssignmentListProps {
  assignments: Assignment[]
}

export default function ParentAssignmentList({ assignments }: ParentAssignmentListProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "late">("all")

  // 과제 상태별 필터링
  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "all") return true
    return assignment.status === filter
  })

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0",
    )}`
  }

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">완료</Badge>
      case "late":
        return <Badge className="bg-red-500">지연</Badge>
      default:
        return <Badge className="bg-yellow-500">진행 중</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>과제 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">전체 ({assignments.length})</TabsTrigger>
            <TabsTrigger value="pending">
              진행 중 ({assignments.filter((a) => a.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              완료 ({assignments.filter((a) => a.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="late">지연 ({assignments.filter((a) => a.status === "late").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filter === "all" ? "등록된 과제가 없습니다." : `${filter} 상태의 과제가 없습니다.`}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-3 w-3 mr-1" />
                        마감일: {formatDate(assignment.due_date)}
                      </div>
                      {assignment.completed_at && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          완료일: {formatDate(assignment.completed_at)}
                        </div>
                      )}
                    </div>
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
