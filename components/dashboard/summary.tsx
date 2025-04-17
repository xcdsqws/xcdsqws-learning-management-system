import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardSummaryProps {
  totalAssignments: number
  pendingAssignments: number
  totalStudyTime: number
}

export default function DashboardSummary({
  totalAssignments,
  pendingAssignments,
  totalStudyTime,
}: DashboardSummaryProps) {
  // 시간 형식 변환 (분 -> 시간:분)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">총 과제</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssignments}개</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">미완료 과제</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingAssignments}개</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">총 공부 시간</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(totalStudyTime)}</div>
        </CardContent>
      </Card>
    </>
  )
}
