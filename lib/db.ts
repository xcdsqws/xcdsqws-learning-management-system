"use server"

import { supabaseAdmin } from "./supabase"
import bcryptjs from "bcryptjs" // bcrypt에서 bcryptjs로 변경
import type {
  User,
  Subject,
  StudyLog,
  Assignment,
  Grade,
  Report,
  Notification,
  StudyGoal,
  DailyReflection,
  Student,
  StudyStatistics,
} from "./types"

// 사용자 인증 및 정보 조회
export async function getUser(id: string, password: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

    if (error || !user) {
      return null
    }

    // 비밀번호 검증
    const passwordMatch = await bcryptjs.compare(password, user.password)

    if (!passwordMatch) {
      return null
    }

    return user
  } catch (error) {
    console.error("사용자 조회 오류:", error)
    return null
  }
}

// 사용자 ID로 정보 조회
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("사용자 조회 오류:", error)
    return null
  }
}

// 과목 목록 조회
export async function getSubjects(): Promise<Subject[]> {
  try {
    const { data, error } = await supabaseAdmin.from("subjects").select("*").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("과목 목록 조회 오류:", error)
    return []
  }
}

// 과목 추가
export async function addSubject(name: string): Promise<Subject | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("subjects")
      .insert([{ name, created_at: new Date().toISOString() }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("과목 추가 오류:", error)
    return null
  }
}

// 과목 삭제
export async function deleteSubject(id: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("subjects").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("과목 삭제 오류:", error)
    return false
  }
}

// 학습 로그 목록 조회
export async function getStudyLogs(studentId: string): Promise<StudyLog[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("study_logs")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학습 로그 목록 조회 오류:", error)
    return []
  }
}

// 학습 로그 추가
export async function addStudyLog(log: {
  student_id: string
  subject_id: string
  duration: number
  content: string
}): Promise<StudyLog | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("study_logs")
      .insert([
        {
          student_id: log.student_id,
          subject_id: log.subject_id,
          duration: log.duration,
          content: log.content,
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("학습 로그 추가 오류:", error)
    return null
  }
}

// 학습 로그 삭제
export async function deleteStudyLog(id: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("study_logs").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("학습 로그 삭제 오류:", error)
    return false
  }
}

// 과제 목록 조회
export async function getAssignments(studentId: string): Promise<Assignment[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("assignments")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("due_date", { ascending: true })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("과제 목록 조회 오류:", error)
    return []
  }
}

// 과제 추가
export async function addAssignment(assignment: {
  student_id: string
  title: string
  description: string
  subject_id: string
  due_date: string
  status: string
}): Promise<Assignment | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("assignments")
      .insert([
        {
          student_id: assignment.student_id,
          subject_id: assignment.subject_id,
          title: assignment.title,
          description: assignment.description,
          due_date: assignment.due_date,
          status: assignment.status,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("과제 추가 오류:", error)
    return null
  }
}

// 과제 상태 업데이트
export async function updateAssignment(id: string, updates: any): Promise<Assignment | null> {
  try {
    const { data, error } = await supabaseAdmin.from("assignments").update(updates).eq("id", id).select().single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("과제 상태 업데이트 오류:", error)
    return null
  }
}

// 과제 삭제
export async function deleteAssignment(id: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("assignments").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("과제 삭제 오류:", error)
    return false
  }
}

// 성적 목록 조회
export async function getGrades(studentId: string): Promise<Grade[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("grades")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("성적 목록 조회 오류:", error)
    return []
  }
}

// 성적 추가
export async function addGrade(
  studentId: string,
  subjectId: number,
  testName: string,
  score: number,
  maxScore: number,
  date: string,
): Promise<Grade | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("grades")
      .insert([
        {
          student_id: studentId,
          subject_id: subjectId,
          test_name: testName,
          score,
          max_score: maxScore,
          date,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("성적 추가 오류:", error)
    return null
  }
}

// 성적 삭제
export async function deleteGrade(id: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("grades").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("성적 삭제 오류:", error)
    return false
  }
}

// 보고서 생성
export async function generateReport(studentId: string): Promise<Report | null> {
  try {
    // 기간 설정
    const now = new Date()
    // 일주일 전
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const endDate = now

    // 학습 로그 조회
    const { data: studyLogs, error: studyLogsError } = await supabaseAdmin
      .from("study_logs")
      .select("*")
      .eq("student_id", studentId)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])

    if (studyLogsError) {
      throw studyLogsError
    }

    // 과제 조회
    const { data: assignments, error: assignmentsError } = await supabaseAdmin
      .from("assignments")
      .select("*")
      .eq("student_id", studentId)
      .gte("due_date", startDate.toISOString().split("T")[0])
      .lte("due_date", endDate.toISOString().split("T")[0])

    if (assignmentsError) {
      throw assignmentsError
    }

    // 성적 조회
    const { data: grades, error: gradesError } = await supabaseAdmin
      .from("grades")
      .select("*")
      .eq("student_id", studentId)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])

    if (gradesError) {
      throw gradesError
    }

    // 일일 성찰 조회
    const { data: reflections, error: reflectionsError } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])

    if (reflectionsError) {
      throw reflectionsError
    }

    // 총 학습 시간 계산
    const totalStudyTime = studyLogs ? studyLogs.reduce((sum, log) => sum + log.duration, 0) : 0

    // 과목별 학습 시간 계산
    const subjectStudyTime: Record<string, number> = {}
    if (studyLogs) {
      studyLogs.forEach((log) => {
        if (!subjectStudyTime[log.subject_id]) {
          subjectStudyTime[log.subject_id] = 0
        }
        subjectStudyTime[log.subject_id] += log.duration
      })
    }

    // 완료된 과제 수 계산
    const completedAssignments = assignments
      ? assignments.filter((assignment) => assignment.status === "completed").length
      : 0

    // 평균 성적 계산
    let averageScore = 0
    if (grades && grades.length > 0) {
      const totalPercentage = grades.reduce((sum, grade) => sum + (grade.score / grade.max_score) * 100, 0)
      averageScore = totalPercentage / grades.length
    }

    // 평균 자기 평가 점수 계산
    let averageSelfRating = 0
    if (reflections && reflections.length > 0) {
      const totalRating = reflections.reduce((sum, reflection) => sum + reflection.self_rating, 0)
      averageSelfRating = totalRating / reflections.length
    }

    // 성찰 요약 생성
    let reflectionSummary = ""
    if (reflections && reflections.length > 0) {
      // 최근 5개 성찰 내용 요약
      const recentReflections = reflections
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
      reflectionSummary = recentReflections.map((r) => r.content).join(" / ")
    }

    // 보고서 생성
    const report: Partial<Report> = {
      student_id: studentId,
      period: "weekly",
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      total_study_time: totalStudyTime,
      subject_study_time: subjectStudyTime,
      completed_assignments: completedAssignments,
      total_assignments: assignments ? assignments.length : 0,
      average_score: averageScore,
      average_self_rating: averageSelfRating,
      reflection_summary: reflectionSummary,
      reflection_count: reflections ? reflections.length : 0,
      created_at: new Date().toISOString(),
    }

    // 보고서 저장
    const { data: savedReport, error: saveError } = await supabaseAdmin
      .from("reports")
      .insert([report])
      .select()
      .single()

    if (saveError) {
      throw saveError
    }

    return savedReport
  } catch (error) {
    console.error("보고서 생성 오류:", error)
    return null
  }
}

// 보고서 조회
export async function getReports(studentId: string): Promise<Report[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("보고서 조회 오류:", error)
    return []
  }
}

// 보고서 상세 조회
export async function getReportById(id: number): Promise<Report | null> {
  try {
    const { data, error } = await supabaseAdmin.from("reports").select("*").eq("id", id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("보고서 상세 조회 오류:", error)
    return null
  }
}

// 알림 목록 조회
export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("알림 목록 조회 오류:", error)
    return []
  }
}

// 알림 추가
export async function addNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "warning" | "success" | "error",
): Promise<Notification | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert([
        {
          user_id: userId,
          title,
          message,
          type,
          read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("알림 추가 오류:", error)
    return null
  }
}

// 알림 읽음 처리
export async function markNotificationAsRead(id: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("notifications").update({ read: true }).eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("알림 읽음 처리 오류:", error)
    return false
  }
}

// 모든 알림 읽음 처리
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("모든 알림 읽음 처리 오류:", error)
    return false
  }
}

// 학습 목표 조회
export async function getStudyGoals(studentId: string): Promise<StudyGoal[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("study_goals")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학습 목표 조회 오류:", error)
    return []
  }
}

// 학습 목표 추가/수정
export async function upsertStudyGoal(goal: {
  student_id: string
  subject_id: string
  target_minutes: number
  period: string
}): Promise<StudyGoal | null> {
  try {
    // 기존 목표 확인
    const { data: existingGoal, error: checkError } = await supabaseAdmin
      .from("study_goals")
      .select("*")
      .eq("student_id", goal.student_id)
      .eq("subject_id", goal.subject_id)
      .eq("period", goal.period)
      .maybeSingle()

    if (checkError) {
      throw checkError
    }

    let result

    if (existingGoal) {
      // 기존 목표 업데이트
      const { data, error } = await supabaseAdmin
        .from("study_goals")
        .update({
          target_minutes: goal.target_minutes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingGoal.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // 새 목표 추가
      const { data, error } = await supabaseAdmin
        .from("study_goals")
        .insert([
          {
            student_id: goal.student_id,
            subject_id: goal.subject_id,
            target_minutes: goal.target_minutes,
            period: goal.period,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return result
  } catch (error) {
    console.error("학습 목표 추가/수정 오류:", error)
    return null
  }
}

// 학습 목표 삭제
export async function deleteStudyGoal(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("study_goals").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("학습 목표 삭제 오류:", error)
    return false
  }
}

// 일일 성찰 추가
export async function addDailyReflection(reflection: {
  student_id: string
  reflection_date: string
  content: string
  self_rating: number
}): Promise<DailyReflection | null> {
  try {
    // 기존 성찰 확인
    const { data: existingReflection, error: checkError } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", reflection.student_id)
      .eq("date", reflection.reflection_date)
      .maybeSingle()

    if (checkError) {
      throw checkError
    }

    let result

    if (existingReflection) {
      // 기존 성찰 업데이트
      const { data, error } = await supabaseAdmin
        .from("daily_reflections")
        .update({
          content: reflection.content,
          self_rating: reflection.self_rating,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingReflection.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // 새 성찰 추가
      const { data, error } = await supabaseAdmin
        .from("daily_reflections")
        .insert([
          {
            student_id: reflection.student_id,
            date: reflection.reflection_date,
            content: reflection.content,
            self_rating: reflection.self_rating,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return result
  } catch (error) {
    console.error("일일 성찰 추가 오류:", error)
    return null
  }
}

// 일일 성찰 목록 조회
export async function getDailyReflections(studentId: string): Promise<DailyReflection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("일일 성찰 목록 조회 오류:", error)
    return []
  }
}

// 특정 날짜의 성찰 조회
export async function getReflectionByDate(studentId: string, date: string): Promise<DailyReflection | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .eq("date", date)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error("일일 성찰 조회 오류:", error)
    return null
  }
}

// 일일 성찰 삭제
export async function deleteDailyReflection(id: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("daily_reflections").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("일일 성찰 삭제 오류:", error), error
    )
    return false
  }
}

// 학생 목록 조회
export async function getAllStudents(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("role", "student")
      .order("grade")
      .order("class")
      .order("number")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학생 목록 조회 오류:", error)
    return []
  }
}

// 학생 상세 정보 조회
export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).eq("role", "student").single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error("학생 조회 오류:", error)
    return null
  }
}

// 학생의 과제 조회
export async function getStudentAssignments(studentId: string): Promise<Assignment[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("assignments")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
    \
      .order("due_date",
    ascending: false
    )

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학생 과제 조회 오류:", error)
    return []
  }
}

// 학생의 성적 조회
export async function getStudentGrades(studentId: string): Promise<Grade[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("grades")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학생 성적 조회 오류:", error)
    return []
  }
}

// 학생의 학습 로그 조회
export async function getStudentStudyLogs(studentId: string): Promise<StudyLog[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("study_logs")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학생 학습 로그 조회 오류:", error)
    return []
  }
}

// 학생의 성찰 조회
export async function getStudentReflections(studentId: string): Promise<DailyReflection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학생 성찰 조회 오류:", error)
    return []
  }
}

// 모든 성적 조회 (관리자용)
export async function getAllGrades(): Promise<Grade[]> {
  try {
    const { data, error } = await supabaseAdmin.from("grades").select("*").order("timestamp", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("전체 성적 조회 오류:", error)
    return []
  }
}

// 모든 과제 조회 (관리자용)
export async function getAllAssignments(): Promise<Assignment[]> {
  try {
    const { data, error } = await supabaseAdmin.from("assignments").select("*").order("due_date", { ascending: true })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("전체 과제 조회 오류:", error)
    return []
  }
}

// 모든 성찰 조회 (관리자용)
export async function getAllReflections(): Promise<DailyReflection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("전체 성찰 조회 오류:", error)
    return []
  }
}

// 최근 성찰 조회
export async function getRecentReflections(): Promise<DailyReflection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .order("date", { ascending: false })
      .limit(5)

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("최근 성찰 조회 오류:", error)
    return []
  }
}

// 학습 통계 조회
export async function getStudyStatistics(studentId: string): Promise<StudyStatistics> {
  try {
    // 기본 통계 객체 초기화
    const statistics: StudyStatistics = {
      totalTime: 0,
      dailyTime: {},
      weeklyTime: {},
      monthlyTime: {},
      subjectTime: {},
    }

    // 학습 로그 조회
    const { data: logs, error } = await supabaseAdmin
      .from("study_logs")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (error) {
      throw error
    }

    if (!logs || logs.length === 0) {
      return statistics
    }

    // 총 학습 시간 계산
    statistics.totalTime = logs.reduce((sum, log) => sum + log.duration, 0)

    // 일별, 주별, 월별, 과목별 학습 시간 계산
    logs.forEach((log) => {
      const date = new Date(log.date)
      const dateKey = log.date
      const weekNumber = getWeekNumber(date)
      const weekKey = `${date.getFullYear()}-${weekNumber.toString().padStart(2, "0")}`
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

      // 일별 학습 시간
      if (!statistics.dailyTime[dateKey]) {
        statistics.dailyTime[dateKey] = 0
      }
      statistics.dailyTime[dateKey] += log.duration

      // 주별 학습 시간
      if (!statistics.weeklyTime[weekKey]) {
        statistics.weeklyTime[weekKey] = 0
      }
      statistics.weeklyTime[weekKey] += log.duration

      // 월별 학습 시간
      if (!statistics.monthlyTime[monthKey]) {
        statistics.monthlyTime[monthKey] = 0
      }
      statistics.monthlyTime[monthKey] += log.duration

      // 과목별 학습 시간
      if (!statistics.subjectTime[log.subject_id]) {
        statistics.subjectTime[log.subject_id] = 0
      }
      statistics.subjectTime[log.subject_id] += log.duration
    })

    return statistics
  } catch (error) {
    console.error("학습 통계 조회 오류:", error)
    return {
      totalTime: 0,
      dailyTime: {},
      weeklyTime: {},
      monthlyTime: {},
      subjectTime: {},
    }
  }
}

// 주차 계산 함수
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// 학부모 계정 추가
export async function addParentAccount(parent: {
  id: string
  password: string
  name: string
  child_id: string
  role: string
}): Promise<User | null> {
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(parent.password, 10)

    // 계정 생성
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          id: parent.id,
          password: hashedPassword,
          name: parent.name,
          role: parent.role,
          child_id: parent.child_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("학부모 계정 추가 오류:", error)
    return null
  }
}
