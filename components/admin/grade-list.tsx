"use client"

import { useState, useEffect } from "react"
import type { Grade, Subject, User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllGrades } from "@/lib/db"

interface AdminGradeListProps {
  students: User[]
  subjects: Subject[]
}

export default function AdminGradeList({ students, subjects }: AdminGradeListProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<string>("all")

  useEffect(() => {
    loadGrades()
  }, [])

  const loadGrades = async () => {
    setIsLoading(true)
    try {
      const data = await getAllGrades()
      setGrades(data)
    } catch (error) {
      console.error("성적 목록 로딩 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 과목 ID로 과목명 찾기
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : subjectId
  }

  // 학생 ID로 학생 이름 찾기
  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? student.name : studentId
  }

  // 학생 ID로 학생 정보 문자열 생성
  const getStudentInfo = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return studentId
    return `${student.grade}학년 ${student.class}반 ${student.number}번 ${student.name}`
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

  // 필터링된 성적 목록
  const filteredGrades =
    selectedStudent === "all" ? grades : grades.filter((grade) => grade.student_id === selectedStudent)

  // 최신순으로 정렬
  const sortedGrades = [...filteredGrades].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>성적 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="학생 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 학생</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.grade}학년 {student.class}반 {student.number}번 {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-4">성적 정보를 불러오는 중...</div>
        ) : sortedGrades.length === 0 ? (
          <p className="text-gray-500 text-center py-4">등록된 성적이 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>학생</TableHead>
                <TableHead>시험명</TableHead>
                <TableHead>과목</TableHead>
                <TableHead>점수</TableHead>
                <TableHead>등록일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{getStudentInfo(grade.student_id)}</TableCell>
                  <TableCell>{grade.test_name}</TableCell>
                  <TableCell>{getSubjectName(grade.subject_id)}</TableCell>
                  <TableCell>{formatScore(grade.score, grade.max_score)}</TableCell>
                  <TableCell>{formatDate(grade.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
