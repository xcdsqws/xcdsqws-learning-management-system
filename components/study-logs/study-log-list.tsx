import type { StudyLog, Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StudyLogListProps {
  studyLogs: StudyLog[]
  subjects: Subject[]
}

export default function StudyLogList({ studyLogs, subjects }: StudyLogListProps) {
  // 과목 ID로 과목명 찾기
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : subjectId
  }

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  // 시간 형식 변환 (분 -> 시간:분)
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`
  }

  // 최신순으로 정렬
  const sortedLogs = [...studyLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>학습 기록 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedLogs.length === 0 ? (
          <p className="text-gray-500">등록된 학습 기록이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {sortedLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{getSubjectName(log.subject_id)}</h3>
                  <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                </div>
                <div className="text-sm text-gray-700 mb-2">공부 시간: {formatDuration(log.duration)}</div>
                <p className="text-sm text-gray-700">{log.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
