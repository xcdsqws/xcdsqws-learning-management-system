import type { Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SubjectListProps {
  subjects: Subject[]
}

export default function SubjectList({ subjects }: SubjectListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>과목 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <p className="text-gray-500">등록된 과목이 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>과목명</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
