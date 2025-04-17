"use client"

import { useState } from "react"
import type { Assignment, Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateAssignment } from "@/lib/db"

interface AssignmentListProps {
  assignments: Assignment[]
  subjects: Subject[]
}

export default function AssignmentList({ assignments, subjects }: AssignmentListProps) {
  const [localAssignments, setLocalAssignments] = useState(assignments)

  // 과목 ID로 과목명 찾기
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : subjectId
  }

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
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

  // 과제 완료 처리
  const handleCompleteAssignment = async (id: string) => {
    const updatedAssignment = await updateAssignment(id, {
      status: "completed",
      completed_at: new Date().toISOString(),
    })

    if (updatedAssignment) {
      setLocalAssignments((prev) => prev.map((a) => (a.id === id ? updatedAssignment : a)))
    }
  }

  // 상태별 과제 필터링
  const pendingAssignments = localAssignments.filter((a) => a.status === "pending")
  const completedAssignments = localAssignments.filter((a) => a.status === "completed")
  const lateAssignments = localAssignments.filter((a) => a.status === "late")

  return (
    <Card>
      <CardHeader>
        <CardTitle>과제 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">진행 중 ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="completed">완료 ({completedAssignments.length})</TabsTrigger>
            <TabsTrigger value="late">지연 ({lateAssignments.length})</TabsTrigger>
            <TabsTrigger value="all">전체 ({localAssignments.length})</TabsTrigger>
          </TabsList>

          {["pending", "completed", "late", "all"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {(tab === "all" ? localAssignments : localAssignments.filter((a) => a.status === tab)).length === 0 ? (
                <p className="text-gray-500">해당 상태의 과제가 없습니다.</p>
              ) : (
                (tab === "all" ? localAssignments : localAssignments.filter((a) => a.status === tab)).map(
                  (assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {getSubjectName(assignment.subject_id)} | 마감일: {formatDate(assignment.due_date)}
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{assignment.description}</p>

                      {assignment.status === "pending" && (
                        <Button size="sm" onClick={() => handleCompleteAssignment(assignment.id)}>
                          완료 표시
                        </Button>
                      )}
                    </div>
                  ),
                )
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
