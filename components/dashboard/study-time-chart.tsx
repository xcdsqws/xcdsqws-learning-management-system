"use client"

import { useEffect, useRef } from "react"
import type { StudyLog, Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface StudyTimeChartProps {
  studyLogs: StudyLog[]
  subjects: Subject[]
}

export default function StudyTimeChart({ studyLogs, subjects }: StudyTimeChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 이전 차트 인스턴스 제거
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // 과목별 공부 시간 계산
    const subjectStudyTime: Record<string, number> = {}
    studyLogs.forEach((log) => {
      subjectStudyTime[log.subjectId] = (subjectStudyTime[log.subjectId] || 0) + log.duration
    })

    // 차트 데이터 준비
    const labels = subjects.map((subject) => subject.name)
    const data = subjects.map((subject) =>
      subjectStudyTime[subject.id] ? Math.round((subjectStudyTime[subject.id] / 60) * 10) / 10 : 0,
    )

    // 차트 생성
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "공부 시간 (시간)",
            data,
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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [studyLogs, subjects])

  return (
    <Card>
      <CardHeader>
        <CardTitle>과목별 공부 시간</CardTitle>
      </CardHeader>
      <CardContent>
        {studyLogs.length === 0 ? (
          <p className="text-gray-500">등록된 학습 기록이 없습니다.</p>
        ) : (
          <div className="w-full h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
