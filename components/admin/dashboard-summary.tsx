import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminDashboardSummaryProps {
  totalStudents: number
  totalAssignments: number
}

export default function AdminDashboardSummary({ totalStudents, totalAssignments }: AdminDashboardSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">총 학생 수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}명</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">총 과제 수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssignments}개</div>
        </CardContent>
      </Card>
    </div>
  )
}
