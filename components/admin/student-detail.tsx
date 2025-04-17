"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getStudentById,
  getStudentAssignments,
  getStudentGrades,
  getStudentStudyLogs,
  getStudentReflections,
} from "@/lib/db"
import type { Student, Assignment, Grade, StudyLog, DailyReflection } from "@/lib/types"
import { formatDate, formatDuration } from "@/lib/utils"
import { Calendar, Clock, FileText, User, BookMarked } from "lucide-react"

interface StudentDetailProps {
  studentId: string
}

export default function StudentDetail({ studentId }: StudentDetailProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([])
  const [reflections, setReflections] = useState<DailyReflection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentData = await getStudentById(studentId)
        const assignmentsData = await getStudentAssignments(studentId)
        const gradesData = await getStudentGrades(studentId)
        const studyLogsData = await getStudentStudyLogs(studentId)
        const reflectionsData = await getStudentReflections(studentId)

        setStudent(studentData)
        setAssignments(assignmentsData)
        setGrades(gradesData)
        setStudyLogs(studyLogsData)
        setReflections(reflectionsData)
        setIsLoading(false)
      } catch (error) {
        console.error("학생 데이터를 불러오는 중 오류가 발생했습니다:", error)
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [studentId])

  if (isLoading) {
    return <div className="flex justify-center p-8">데이터를 불러오는 중...</div>
  }

  if (!student) {
    return <div className="text-center p-8">학생 정보를 찾을 수 없습니다.</div>
  }

  // 평균 성적 계산
  const averageGrade = grades.length > 0 ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length : 0

  // 총 학습 시간 계산 (분 단위)
  const totalStudyTime = studyLogs.reduce((sum, log) => sum + log.duration, 0)

  // 평균 자기평가 점수 계산
  const averageSelfRating =
    reflections.length > 0
      ? reflections.reduce((sum, reflection) => sum + reflection.self_rating, 0) / reflections.length
      : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">학생 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">이름:</span>
                <span className="ml-2">{student.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">학년:</span>
                <span className="ml-2">{student.grade}학년</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">평균 성적:</span>
                <span className="ml-2">{averageGrade.toFixed(1)}점</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">총 학습 시간:</span>
                <span className="ml-2">{formatDuration(totalStudyTime)}</span>
              </div>
              <div className="flex items-center">
                <BookMarked className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">평균 자기평가:</span>
                <span className="ml-2">{averageSelfRating.toFixed(1)}점</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="assignments">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="assignments">과제</TabsTrigger>
          <TabsTrigger value="grades">성적</TabsTrigger>
          <TabsTrigger value="studyLogs">학습 기록</TabsTrigger>
          <TabsTrigger value="reflections">성찰 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">과제 목록</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">과제 기록이 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">과목</th>
                        <th className="text-left py-2 px-4">제목</th>
                        <th className="text-left py-2 px-4">마감일</th>
                        <th className="text-left py-2 px-4">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment) => (
                        <tr key={assignment.id} className="border-b">
                          <td className="py-2 px-4">{assignment.subject}</td>
                          <td className="py-2 px-4">{assignment.title}</td>
                          <td className="py-2 px-4">{formatDate(assignment.due_date)}</td>
                          <td className="py-2 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                assignment.completed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {assignment.completed ? "완료" : "미완료"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">성적 기록</CardTitle>
            </CardHeader>
            <CardContent>
              {grades.length === 0 ? (
                <p className="text-center text-gray-500 py-4">성적 기록이 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">과목</th>
                        <th className="text-left py-2 px-4">시험/과제</th>
                        <th className="text-left py-2 px-4">점수</th>
                        <th className="text-left py-2 px-4">날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id} className="border-b">
                          <td className="py-2 px-4">{grade.subject}</td>
                          <td className="py-2 px-4">{grade.title}</td>
                          <td className="py-2 px-4">{grade.score}점</td>
                          <td className="py-2 px-4">{formatDate(grade.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="studyLogs">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">학습 기록</CardTitle>
            </CardHeader>
            <CardContent>
              {studyLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-4">학습 기록이 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">과목</th>
                        <th className="text-left py-2 px-4">내용</th>
                        <th className="text-left py-2 px-4">학습 시간</th>
                        <th className="text-left py-2 px-4">날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studyLogs.map((log) => (
                        <tr key={log.id} className="border-b">
                          <td className="py-2 px-4">{log.subject}</td>
                          <td className="py-2 px-4">{log.content}</td>
                          <td className="py-2 px-4">{formatDuration(log.duration)}</td>
                          <td className="py-2 px-4">{formatDate(log.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reflections">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">성찰 기록</CardTitle>
            </CardHeader>
            <CardContent>
              {reflections.length === 0 ? (
                <p className="text-center text-gray-500 py-4">성찰 기록이 없습니다.</p>
              ) : (
                <div className="space-y-4">
                  {reflections.map((reflection) => (
                    <Card key={reflection.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{formatDate(reflection.created_at)}</div>
                          <div
                            className={`px-2 py-1 rounded text-xs ${
                              reflection.self_rating >= 4
                                ? "bg-green-100 text-green-800"
                                : reflection.self_rating >= 3
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            자기평가: {reflection.self_rating}점
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{reflection.content}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
