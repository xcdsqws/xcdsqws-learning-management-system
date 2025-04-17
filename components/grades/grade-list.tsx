import type { Grade, Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GradeListProps {
  grades: Grade[]
  subjects: Subject[]
}

export default function GradeList({ grades, subjects }: GradeListProps) {
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

  // 점수 형식 변환 (백분율)
  const formatScore = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    return `${score}/${maxScore} (${percentage.toFixed(1)}%)`
  }

  // 최신순으로 정렬
  const sortedGrades = [...grades].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>성적 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedGrades.length === 0 ? (
          <p className="text-gray-500">등록된 성적이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {sortedGrades.map((grade) => (
              <div key={grade.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{grade.test_name}</h3>
                  <span className="text-sm text-gray-500">{formatDate(grade.timestamp)}</span>
                </div>
                <div className="text-sm text-gray-700 mb-2">과목: {getSubjectName(grade.subject_id)}</div>
                <div className="text-sm text-gray-700">점수: {formatScore(grade.score, grade.max_score)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
