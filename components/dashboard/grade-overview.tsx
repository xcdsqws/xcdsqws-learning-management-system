"use client"

import { useEffect, useRef } from "react"
import type { Grade, Subject } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface GradeOverviewProps {
  grades: Grade[]
  subjects: Subject[]
}

export default function GradeOverview({ grades, subjects }: GradeOverviewProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 이전 차트 인스턴스 제거
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // 과목별 평균 성적 계산
    const subjectGrades: Record<string, { total: number; count: number }> = {}
    grades.forEach((grade) => {
      if (!subjectGrades[grade.subjectId]) {
        subjectGrades[grade.subjectId] = { total: 0, count: 0 }
      }
      subjectGrades[grade.subjectId].total += (grade.score / grade.maxScore) * 100
      subjectGrades[grade.subjectId].count += 1
    })

    // 차트 데이터 준비
    const labels = subjects.map((subject) => subject.name)
    const data = subjects.map((subject) => {
      const gradeData = subjectGrades[subject.id]
      return gradeData ? Math.round((gradeData.total / gradeData.count) * 10) / 10 : 0
    })

    // 차트 생성
    chartInstance.current = new Chart(chartRef.current, {
      type: "radar",
      data: {
        labels,
        datasets: [
          {
            label: "평균 성적 (%)",
            data,
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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [grades, subjects])

  return (
    <Card>
      <CardHeader>
        <CardTitle>성적 개요</CardTitle>
      </CardHeader>
      <CardContent>
        {grades.length === 0 ? (
          <p className="text-gray-500">등록된 성적이 없습니다.</p>
        ) : (
          <div className="w-full h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
