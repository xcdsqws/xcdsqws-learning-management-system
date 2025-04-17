"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Report, StudyLog, Grade, Subject } from "@/lib/types"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface ParentReportViewProps {
  report: Report
  studyLogs: StudyLog[]
  grades: Grade[]
  subjects: Subject[]
}

export default function ParentReportView({ report, studyLogs, grades, subjects }: ParentReportViewProps) {
  const studyTimeChartRef = useRef<HTMLCanvasElement>(null)
  const gradeChartRef = useRef<HTMLCanvasElement>(null)

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // 시간 형식 변환 (분 -> 시간:분)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  // 과목 ID로 과목명 찾기
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : subjectId
  }

  useEffect(() => {
    // 공부 시간 차트
    if (studyTimeChartRef.current) {
      const ctx = studyTimeChartRef.current.getContext("2d")
      if (ctx) {
        const subjectNames = subjects.map((s) => s.name)
        const studyTimeData = subjects.map((s) => {
          const time = report.subject_study_time[s.id] || 0
          return Math.round((time / 60) * 10) / 10 // 시간 단위로 변환
        })

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: subjectNames,
            datasets: [
              {
                label: "공부 시간 (시간)",
                data: studyTimeData,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "시간 (시간)",
                },
              },
            },
          },
        })
      }
    }

    // 성적 차트
    if (gradeChartRef.current && grades.length > 0) {
      const ctx = gradeChartRef.current.getContext("2d")
      if (ctx) {
        // 과목별 평균 성적 계산
        const subjectGrades: Record<string, { total: number; count: number }> = {}
        grades.forEach((grade) => {
          if (!subjectGrades[grade.subject_id]) {
            subjectGrades[grade.subject_id] = { total: 0, count: 0 }
          }
          subjectGrades[grade.subject_id].total += (grade.score / grade.max_score) * 100
          subjectGrades[grade.subject_id].count += 1
        })

        const subjectNames = subjects.map((s) => s.name)
        const gradeData = subjects.map((s) => {
          const data = subjectGrades[s.id]
          return data ? Math.round((data.total / data.count) * 10) / 10 : 0
        })

        new Chart(ctx, {
          type: "radar",
          data: {
            labels: subjectNames,
            datasets: [
              {
                label: "평균 성적 (%)",
                data: gradeData,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(54, 162, 235, 1)",
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 20,
                },
              },
            },
          },
        })
      }
    }
  }, [report, grades, subjects])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>학습 리포트 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">총 공부 시간</div>
              <div className="text-2xl font-bold">{formatTime(report.total_study_time)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">평균 성적</div>
              <div className="text-2xl font-bold">{report.average_grade.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">리포트 생성일</div>
              <div className="text-2xl font-bold">{formatDate(report.timestamp)}</div>
            </div>
          </div>

          <div className="text-gray-700 mb-4">
            <p>
              이 리포트는 학생의 학습 활동과 성적을 분석하여 생성되었습니다. 아래 차트를 통해 과목별 공부 시간과 성적
              분포를 확인할 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>과목별 공부 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <canvas ref={studyTimeChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>과목별 성적</CardTitle>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <p className="text-gray-500">등록된 성적이 없습니다.</p>
            ) : (
              <div className="w-full h-64">
                <canvas ref={gradeChartRef}></canvas>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>학습 분석 및 제안</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">공부 시간 분석</h3>
              <p className="text-gray-700">
                {Object.keys(report.subject_study_time).length === 0 ? (
                  "아직 등록된 학습 기록이 없습니다. 자녀에게 학습 기록을 남기도록 권장해주세요."
                ) : (
                  <>
                    총 {formatTime(report.total_study_time)}의 학습 시간 중,
                    {Object.entries(report.subject_study_time)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 1)
                      .map(
                        ([subjectId, time]) =>
                          `${getSubjectName(subjectId)}에 가장 많은 시간(${formatTime(time)})을 투자했습니다.`,
                      )}
                    {Object.entries(report.subject_study_time)
                      .sort((a, b) => a[1] - b[1])
                      .slice(0, 1)
                      .map(
                        ([subjectId, time]) =>
                          ` ${getSubjectName(subjectId)}에는 상대적으로 적은 시간(${formatTime(time)})을 투자했습니다.`,
                      )}
                  </>
                )}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">성적 분석</h3>
              <p className="text-gray-700">
                {grades.length === 0
                  ? "아직 등록된 성적이 없습니다. 자녀의 성적을 등록하면 더 정확한 분석을 받아볼 수 있습니다."
                  : `전체 과목의 평균 성적은 ${report.average_grade.toFixed(1)}%입니다.`}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">학부모님을 위한 제안</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>자녀가 정기적인 학습 계획을 세우고 실천할 수 있도록 격려해주세요.</li>
                <li>부족한 과목에 더 많은 시간을 투자하도록 조언해주세요.</li>
                <li>학습 내용을 복습하고 문제를 풀어보며 이해도를 높일 수 있도록 도와주세요.</li>
                <li>어려운 개념은 선생님이나 친구들에게 질문하여 해결하도록 권장해주세요.</li>
                <li>충분한 휴식과 규칙적인 생활 습관이 학습 효율을 높인다는 점을 알려주세요.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
