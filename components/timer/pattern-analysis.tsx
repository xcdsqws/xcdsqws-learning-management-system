"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { StudyStatistics } from "@/lib/types"

interface PatternAnalysisProps {
  statistics: StudyStatistics
}

export default function PatternAnalysis({ statistics }: PatternAnalysisProps) {
  // 시간대별 학습 시간 데이터 준비
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}시`,
    time: Math.round(((statistics.hourlyDistribution[i.toString()] || 0) / 60) * 10) / 10, // 분 -> 시간 변환 (소수점 1자리)
  }))

  // 요일별 학습 시간 데이터 준비
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const dayOfWeekData = dayNames.map((name, i) => ({
    day: `${name}요일`,
    time: Math.round(((statistics.dayOfWeekDistribution[i.toString()] || 0) / 60) * 10) / 10, // 분 -> 시간 변환 (소수점 1자리)
  }))

  // 학습 패턴 분석
  const getOptimalStudyTime = () => {
    // 가장 학습 시간이 많은 시간대 찾기
    const maxHourlyTime = Math.max(...Object.values(statistics.hourlyDistribution).map((time) => time || 0))
    const optimalHours = Object.entries(statistics.hourlyDistribution)
      .filter(([_, time]) => time === maxHourlyTime && time > 0)
      .map(([hour]) => Number.parseInt(hour))
      .sort((a, b) => a - b)

    if (optimalHours.length === 0) return "아직 충분한 학습 데이터가 없습니다."

    return optimalHours.map((hour) => `${hour}시`).join(", ")
  }

  const getOptimalStudyDay = () => {
    // 가장 학습 시간이 많은 요일 찾기
    const maxDayTime = Math.max(...Object.values(statistics.dayOfWeekDistribution).map((time) => time || 0))
    const optimalDays = Object.entries(statistics.dayOfWeekDistribution)
      .filter(([_, time]) => time === maxDayTime && time > 0)
      .map(([day]) => Number.parseInt(day))
      .sort((a, b) => a - b)

    if (optimalDays.length === 0) return "아직 충분한 학습 데이터가 없습니다."

    return optimalDays.map((day) => `${dayNames[day]}요일`).join(", ")
  }

  const getStudyConsistency = () => {
    // 학습 일수 / 전체 기간
    const days = Object.keys(statistics.dailyTime).length
    if (days === 0) return "아직 학습 기록이 없습니다."

    // 최근 30일 중 학습한 일수의 비율
    const consistency = Math.round((days / 30) * 100)

    if (consistency >= 80) return `매우 좋음 (${consistency}%)`
    if (consistency >= 60) return `좋음 (${consistency}%)`
    if (consistency >= 40) return `보통 (${consistency}%)`
    if (consistency >= 20) return `개선 필요 (${consistency}%)`
    return `많은 개선 필요 (${consistency}%)`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>학습 패턴 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">최적 학습 시간대</div>
              <div className="text-xl font-bold">{getOptimalStudyTime()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">최적 학습 요일</div>
              <div className="text-xl font-bold">{getOptimalStudyDay()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">학습 일관성</div>
              <div className="text-xl font-bold">{getStudyConsistency()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">시간대별 학습 패턴</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis label={{ value: "시간", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`${value} 시간`, "학습 시간"]} />
                    <Legend />
                    <Bar dataKey="time" fill="#8884d8" name="학습 시간 (시간)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">요일별 학습 패턴</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={dayOfWeekData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="day" />
                    <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                    <Radar name="학습 시간 (시간)" dataKey="time" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => [`${value} 시간`, "학습 시간"]} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">학습 패턴 분석 결과</h3>
            <ul className="list-disc pl-5 space-y-1">
              {Object.values(statistics.hourlyDistribution).some((time) => time > 0) ? (
                <>
                  <li>
                    가장 학습 효율이 높은 시간대는 <strong>{getOptimalStudyTime()}</strong>입니다.
                  </li>
                  <li>
                    <strong>{getOptimalStudyDay()}</strong>에 가장 많은 학습을 하고 있습니다.
                  </li>
                  <li>
                    학습 일관성은 <strong>{getStudyConsistency()}</strong>입니다.
                  </li>
                  {Object.keys(statistics.dailyTime).length > 0 && (
                    <li>
                      최근 30일 중 <strong>{Object.keys(statistics.dailyTime).length}일</strong> 학습했습니다.
                    </li>
                  )}
                </>
              ) : (
                <li>아직 충분한 학습 데이터가 없습니다. 더 많은 학습 기록을 쌓아보세요.</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
