import Link from "next/link"
import type { User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StudentListProps {
  students: User[]
}

export default function StudentList({ students }: StudentListProps) {
  // 학년, 반 기준으로 정렬
  const sortedStudents = [...students].sort((a, b) => {
    if (a.grade !== b.grade) {
      return (a.grade || 0) - (b.grade || 0)
    }
    if (a.class !== b.class) {
      return (a.class || 0) - (b.class || 0)
    }
    return (a.number || 0) - (b.number || 0)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>학생 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedStudents.length === 0 ? (
          <p className="text-gray-500">등록된 학생이 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>학번</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>학년</TableHead>
                <TableHead>반</TableHead>
                <TableHead>번호</TableHead>
                <TableHead>상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.number}</TableCell>
                  <TableCell>
                    <Link href={`/admin/students/${student.id}`} className="text-blue-600 hover:underline">
                      상세 보기
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
