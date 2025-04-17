import type { Assignment, Subject, User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AdminAssignmentListProps {
  assignments: Assignment[]
  subjects: Subject[]
  students: User[]
}

export default function AdminAssignmentList({ assignments, subjects, students }: AdminAssignmentListProps) {
  // 과목 ID로 과목명 찾기
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : subjectId
  }

  // 학생 ID로 학생 이름 찾기
  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? student.name : studentId
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

  // 최신순으로 정렬
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>과제 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAssignments.length === 0 ? (
          <p className="text-gray-500">등록된 과제가 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>학생</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>과목</TableHead>
                <TableHead>마감일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>생성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{getStudentName(assignment.studentId)}</TableCell>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{getSubjectName(assignment.subjectId)}</TableCell>
                  <TableCell>{formatDate(assignment.dueDate)}</TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                  <TableCell>{formatDate(assignment.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
