import type { Assignment, Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface RecentAssignmentsProps {
  assignments: Assignment[]
  subjects: Subject[]
}

export default function RecentAssignments({ assignments, subjects }: RecentAssignmentsProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 과제</CardTitle>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <p className="text-gray-500">등록된 과제가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold">{assignment.title}</h3>
                  {getStatusBadge(assignment.status)}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  {getSubjectName(assignment.subjectId)} | 마감일: {formatDate(assignment.dueDate)}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{assignment.description}</p>
                <Link href={`/assignments/${assignment.id}`} className="text-sm text-blue-600 hover:underline">
                  자세히 보기
                </Link>
              </div>
            ))}

            <div className="text-right mt-4">
              <Link href="/assignments" className="text-sm text-blue-600 hover:underline">
                모든 과제 보기
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
