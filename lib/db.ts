"use server"

import { supabaseAdmin } from "./supabase"
import type {
  User,
  Subject,
  Assignment,
  StudyLog,
  Grade,
  Report,
  StudyGoal,
  StudyStatistics,
  Notification,
  DailyReflection,
  Student,
} from "./types"
import bcrypt from "bcryptjs"

// 사용자 인증
export async function getUser(id: string, password: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

    if (error || !user) {
      console.error("사용자 조회 오류:", error)
      return null
    }

    // 비밀번호 검증 (bcrypt 사용)
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return null
    }

    // 비밀번호 필드 제외하고 반환
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  } catch (err) {
    console.error("사용자 인증 중 오류 발생:", err)
    return null
  }
}

// ID로 사용자 조회
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, name, role, grade, class, number, child_id, created_at")
      .eq("id", id)
      .single()

    if (error || !user) {
      console.error("사용자 조회 오류:", error)
      return null
    }

    return user as User
  } catch (err) {
    console.error("사용자 조회 중 오류 발생:", err)
    return null
  }
}

// ID로 학생 조회 (타입 명확화)
export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const { data: student, error } = await supabaseAdmin
      .from("users")
      .select("id, name, grade, class, number, created_at")
      .eq("id", id)
      .eq("role", "student")
      .single()

    if (error || !student) {
      console.error("학생 조회 오류:", error)
      return null
    }

    return student as Student
  } catch (err) {
    console.error("학생 조회 중 오류 발생:", err)
    return null
  }
}

// 모든 학생 조회 (관리자용)
export async function getAllStudents(): Promise<User[]> {
  try {
    const { data: students, error } = await supabaseAdmin
      .from("users")
      .select("id, name, role, grade, class, number, created_at")
      .eq("role", "student")
      .order("grade")
      .order("class")
      .order("number")

    if (error) {
      console.error("학생 조회 오류:", error)
      return []
    }

    return students as User[]
  } catch (err) {
    console.error("학생 목록 조회 중 오류 발생:", err)
    return []
  }
}

// 과목 조회
export async function getSubjects(): Promise<Subject[]> {
  try {
    const { data: subjects, error } = await supabaseAdmin.from("subjects").select("*").order("id")

    if (error) {
      console.error("과목 조회 오류:", error)
      return []
    }

    return subjects as Subject[]
  } catch (err) {
    console.error("과목 조회 중 오류 발생:", err)
    return []
  }
}

// 과목 추가
export async function addSubject(subject: Subject): Promise<Subject> {
  try {
    // 이미 존재하는 과목인지 확인
    const { data: existingSubject } = await supabaseAdmin.from("subjects").select("*").eq("id", subject.id).single()

    if (existingSubject) {
      throw new Error("이미 존재하는 과목 ID입니다.")
    }

    const { data, error } = await supabaseAdmin.from("subjects").insert([subject]).select().single()

    if (error) {
      console.error("과목 추가 오류:", error)
      throw new Error("과목을 추가하는 중 오류가 발생했습니다.")
    }

    return data as Subject
  } catch (err) {
    console.error("과목 추가 중 오류 발생:", err)
    throw err
  }
}

// 학생별 과제 조회
export async function getAssignmentsByStudent(studentId: string): Promise<Assignment[]> {
  try {
    const { data: assignments, error } = await supabaseAdmin
      .from("assignments")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("과제 조회 오류:", error)
      return []
    }

    return assignments as Assignment[]
  } catch (err) {
    console.error("학생별 과제 조회 중 오류 발생:", err)
    return []
  }
}

// 모든 과제 조회 (관리자용)
export async function getAllAssignments(): Promise<Assignment[]> {
  try {
    const { data: assignments, error } = await supabaseAdmin
      .from("assignments")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("과제 조회 오류:", error)
      return []
    }

    return assignments as Assignment[]
  } catch (err) {
    console.error("전체 과제 조회 중 오류 발생:", err)
    return []
  }
}

// 과제 추가
export async function addAssignment(assignment: Omit<Assignment, "id" | "created_at">): Promise<Assignment> {
  try {
    const id = `assignment_${Date.now()}`
    const newAssignment = {
      id,
      ...assignment,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("assignments").insert([newAssignment]).select().single()

    if (error) {
      console.error("과제 추가 오류:", error)
      throw new Error("과제를 추가하는 중 오류가 발생했습니다.")
    }

    return data as Assignment
  } catch (err) {
    console.error("과제 추가 중 오류 발생:", err)
    throw err
  }
}

// 과제 업데이트
export async function updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment | null> {
  try {
    const { data: updatedAssignment, error } = await supabaseAdmin
      .from("assignments")
      .update(data)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("과제 업데이트 오류:", error)
      return null
    }

    return updatedAssignment as Assignment
  } catch (err) {
    console.error("과제 업데이트 중 오류 발생:", err)
    return null
  }
}

// 학습 로그 조회
export async function getStudyLogsByStudent(studentId: string): Promise<StudyLog[]> {
  try {
    const { data: studyLogs, error } = await supabaseAdmin
      .from("study_logs")
      .select("*")
      .eq("student_id", studentId)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("학습 로그 조회 오류:", error)
      return []
    }

    return studyLogs as StudyLog[]
  } catch (err) {
    console.error("학습 로그 조회 중 오류 발생:", err)
    return []
  }
}

// 학습 로그 추가
export async function addStudyLog(log: Omit<StudyLog, "id" | "timestamp">): Promise<StudyLog> {
  try {
    const id = `log_${Date.now()}`
    const newLog = {
      id,
      ...log,
      timestamp: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("study_logs").insert([newLog]).select().single()

    if (error) {
      console.error("학습 로그 추가 오류:", error)
      throw new Error("학습 로그를 추가하는 중 오류가 발생했습니다.")
    }

    return data as StudyLog
  } catch (err) {
    console.error("학습 로그 추가 중 오류 발생:", err)
    throw err
  }
}

// 성적 조회
export async function getGradesByStudent(studentId: string): Promise<Grade[]> {
  try {
    const { data: grades, error } = await supabaseAdmin
      .from("grades")
      .select("*")
      .eq("student_id", studentId)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("성적 조회 오류:", error)
      return []
    }

    return grades as Grade[]
  } catch (err) {
    console.error("성적 조회 중 오류 발생:", err)
    return []
  }
}

// 모든 성적 조회 (관리자용)
export async function getAllGrades(): Promise<Grade[]> {
  try {
    const { data: grades, error } = await supabaseAdmin
      .from("grades")
      .select("*")
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("성적 조회 오류:", error)
      return []
    }

    return grades as Grade[]
  } catch (err) {
    console.error("전체 성적 조회 중 오류 발생:", err)
    return []
  }
}

// 성적 추가
export async function addGrade(grade: Omit<Grade, "id" | "timestamp">): Promise<Grade> {
  try {
    const id = `grade_${Date.now()}`
    const newGrade = {
      id,
      ...grade,
      timestamp: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("grades").insert([newGrade]).select().single()

    if (error) {
      console.error("성적 추가 오류:", error)
      throw new Error("성적을 추가하는 중 오류가 발생했습니다.")
    }

    return data as Grade
  } catch (err) {
    console.error("성적 추가 중 오류 발생:", err)
    throw err
  }
}

// 리포트 생성
export async function generateReport(studentId: string): Promise<Report> {
  try {
    // 학생의 학습 로그 조회
    const studentLogs = await getStudyLogsByStudent(studentId)

    // 학생의 성적 조회
    const studentGrades = await getGradesByStudent(studentId)

    // 학생의 일일 성찰 조회 (최근 30일)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const startDate = thirtyDaysAgo.toISOString().split("T")[0]
    const studentReflections = await getReflectionsByStudent(studentId, startDate)

    // 총 공부 시간 계산
    const totalStudyTime = studentLogs.reduce((total, log) => total + log.duration, 0)

    // 과목별 공부 시간 계산
    const subjectStudyTime: Record<string, number> = {}
    studentLogs.forEach((log) => {
      subjectStudyTime[log.subject_id] = (subjectStudyTime[log.subject_id] || 0) + log.duration
    })

    // 평균 성적 계산
    const averageGrade =
      studentGrades.length > 0
        ? studentGrades.reduce((total, grade) => total + (grade.score / grade.max_score) * 100, 0) /
          studentGrades.length
        : 0

    // 평균 자기평가 점수 계산
    const averageSelfRating =
      studentReflections.length > 0
        ? studentReflections.reduce((total, reflection) => total + reflection.self_rating, 0) /
          studentReflections.length
        : 0

    // 성찰 내용 요약 (최근 5개)
    const recentReflections = studentReflections.slice(0, 5)
    const reflectionSummary =
      recentReflections.length > 0
        ? recentReflections
            .map((r) => `${r.reflection_date}: ${r.content.substring(0, 50)}${r.content.length > 50 ? "..." : ""}`)
            .join("\n\n")
        : ""

    const id = `report_${Date.now()}`
    const newReport = {
      id,
      student_id: studentId,
      total_study_time: totalStudyTime,
      subject_study_time: subjectStudyTime,
      average_grade: averageGrade,
      timestamp: new Date().toISOString(),
      // 추가된 필드
      average_self_rating: averageSelfRating,
      reflection_summary: reflectionSummary,
      reflection_count: studentReflections.length,
    }

    const { data, error } = await supabaseAdmin.from("reports").insert([newReport]).select().single()

    if (error) {
      console.error("리포트 생성 오류:", error)
      throw new Error("리포트를 생성하는 중 오류가 발생했습니다.")
    }

    return data as Report
  } catch (err) {
    console.error("리포트 생성 중 오류 발생:", err)
    throw err
  }
}

// 리포트 조회
export async function getReportByStudent(studentId: string): Promise<Report | null> {
  try {
    const { data: reports, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("student_id", studentId)
      .order("timestamp", { ascending: false })
      .limit(1)

    if (error || !reports || reports.length === 0) {
      return null
    }

    return reports[0] as Report
  } catch (err) {
    console.error("리포트 조회 중 오류 발생:", err)
    return null
  }
}

// 학습 목표 조회
export async function getStudyGoalsByStudent(studentId: string): Promise<StudyGoal[]> {
  try {
    const { data: goals, error } = await supabaseAdmin
      .from("study_goals")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("학습 목표 조회 오류:", error)
      return []
    }

    return goals as StudyGoal[]
  } catch (err) {
    console.error("학습 목표 조회 중 오류 발생:", err)
    return []
  }
}

// 학습 목표 추가/수정
export async function upsertStudyGoal(goal: Omit<StudyGoal, "id" | "created_at" | "updated_at">): Promise<StudyGoal> {
  try {
    // 기존 목표가 있는지 확인
    const { data: existingGoal } = await supabaseAdmin
      .from("study_goals")
      .select("id")
      .eq("student_id", goal.student_id)
      .eq("subject_id", goal.subject_id)
      .eq("period", goal.period)
      .single()

    const now = new Date().toISOString()

    if (existingGoal) {
      // 기존 목표 업데이트
      const { data, error } = await supabaseAdmin
        .from("study_goals")
        .update({
          target_minutes: goal.target_minutes,
          updated_at: now,
        })
        .eq("id", existingGoal.id)
        .select()
        .single()

      if (error) {
        console.error("학습 목표 업데이트 오류:", error)
        throw new Error("학습 목표를 업데이트하는 중 오류가 발생했습니다.")
      }

      return data as StudyGoal
    } else {
      // 새 목표 추가
      const id = `goal_${Date.now()}`
      const newGoal = {
        id,
        ...goal,
        created_at: now,
        updated_at: now,
      }

      const { data, error } = await supabaseAdmin.from("study_goals").insert([newGoal]).select().single()

      if (error) {
        console.error("학습 목표 추가 오류:", error)
        throw new Error("학습 목표를 추가하는 중 오류가 발생했습니다.")
      }

      return data as StudyGoal
    }
  } catch (err) {
    console.error("학습 목표 추가/수정 중 오류 발생:", err)
    throw err
  }
}

// 학습 목표 삭제
export async function deleteStudyGoal(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("study_goals").delete().eq("id", id)

    if (error) {
      console.error("학습 목표 삭제 오류:", error)
      throw new Error("학습 목표를 삭제하는 중 오류가 발생했습니다.")
    }
  } catch (err) {
    console.error("학습 목표 삭제 중 오류 발생:", err)
    throw err
  }
}

// 학습 통계 조회
export async function getStudyStatistics(studentId: string, days = 30): Promise<StudyStatistics> {
  try {
    // 기준 날짜 설정 (days일 전부터 현재까지)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const startDateStr = startDate.toISOString()

    // 학습 로그 조회
    const { data: logs, error } = await supabaseAdmin
      .from("study_logs")
      .select("*")
      .eq("student_id", studentId)
      .gte("timestamp", startDateStr)
      .order("timestamp", { ascending: true })

    if (error) {
      console.error("학습 통계 조회 오류:", error)
      return {
        totalTime: 0,
        subjectTime: {},
        dailyTime: {},
        weeklyTime: {},
        monthlyTime: {},
        hourlyDistribution: {},
        dayOfWeekDistribution: {},
      }
    }

    const studyLogs = logs as StudyLog[]

    // 총 학습 시간
    const totalTime = studyLogs.reduce((total, log) => total + log.duration, 0)

    // 과목별 학습 시간
    const subjectTime: Record<string, number> = {}
    // 일별 학습 시간
    const dailyTime: Record<string, number> = {}
    // 주별 학습 시간
    const weeklyTime: Record<string, number> = {}
    // 월별 학습 시간
    const monthlyTime: Record<string, number> = {}
    // 시간대별 분포
    const hourlyDistribution: Record<string, number> = {}
    // 요일별 분포
    const dayOfWeekDistribution: Record<string, number> = {
      "0": 0, // 일요일
      "1": 0, // 월요일
      "2": 0, // 화요일
      "3": 0, // 수요일
      "4": 0, // 목요일
      "5": 0, // 금요일
      "6": 0, // 토요일
    }

    studyLogs.forEach((log) => {
      // 과목별 학습 시간
      subjectTime[log.subject_id] = (subjectTime[log.subject_id] || 0) + log.duration

      const date = new Date(log.timestamp)

      // 일별 (YYYY-MM-DD 형식)
      const dailyKey = date.toISOString().split("T")[0]
      dailyTime[dailyKey] = (dailyTime[dailyKey] || 0) + log.duration

      // 주별 (YYYY-WW 형식, WW는 해당 연도의 주차)
      const weekNumber = getWeekNumber(date)
      const weeklyKey = `${date.getFullYear()}-${weekNumber.toString().padStart(2, "0")}`
      weeklyTime[weeklyKey] = (weeklyTime[weeklyKey] || 0) + log.duration

      // 월별 (YYYY-MM 형식)
      const monthlyKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
      monthlyTime[monthlyKey] = (monthlyTime[monthlyKey] || 0) + log.duration

      // 시간대별
      const hour = date.getHours()
      hourlyDistribution[hour.toString()] = (hourlyDistribution[hour.toString()] || 0) + log.duration

      // 요일별
      const dayOfWeek = date.getDay().toString()
      dayOfWeekDistribution[dayOfWeek] = (dayOfWeekDistribution[dayOfWeek] || 0) + log.duration
    })

    return {
      totalTime,
      subjectTime,
      dailyTime,
      weeklyTime,
      monthlyTime,
      hourlyDistribution,
      dayOfWeekDistribution,
    }
  } catch (err) {
    console.error("학습 통계 조회 중 오류 발생:", err)
    return {
      totalTime: 0,
      subjectTime: {},
      dailyTime: {},
      weeklyTime: {},
      monthlyTime: {},
      hourlyDistribution: {},
      dayOfWeekDistribution: {},
    }
  }
}

// 주차 계산 함수
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// 학부모 계정 관련 함수 추가

// 학생의 학부모 계정 조회
export async function getParentsByStudent(studentId: string): Promise<User[]> {
  try {
    const { data: parents, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("role", "parent")
      .eq("child_id", studentId)

    if (error) {
      console.error("학부모 계정 조회 오류:", error)
      return []
    }

    return parents as User[]
  } catch (err) {
    console.error("학부모 계정 조회 중 오류 발생:", err)
    return []
  }
}

// 학부모 계정 추가
export async function addParentAccount(parent: Omit<User, "id" | "created_at">): Promise<User> {
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(parent.password!, 10)

    const id = `parent_${Date.now()}`
    const newParent = {
      id,
      ...parent,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    }

    // 비밀번호 필드 제외하고 반환할 객체 준비
    const { password, ...parentWithoutPassword } = newParent

    const { data, error } = await supabaseAdmin.from("users").insert([newParent]).select().single()

    if (error) {
      console.error("학부모 계정 추가 오류:", error)
      throw new Error("학부모 계정을 추가하는 중 오류가 발생했습니다.")
    }

    // 비밀번호 필드 제외하고 반환
    const { password: _, ...result } = data
    return result as User
  } catch (err) {
    console.error("학부모 계정 추가 중 오류 발생:", err)
    throw err
  }
}

// 알림 관련 함수 추가

// 알림 조회
export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  try {
    const { data: notifications, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(50)

    if (error) {
      console.error("알림 조회 오류:", error)
      return []
    }

    return notifications as Notification[]
  } catch (err) {
    console.error("알림 조회 중 오류 발생:", err)
    return []
  }
}

// 알림 추가
export async function addNotification(notification: Omit<Notification, "id" | "timestamp">): Promise<Notification> {
  try {
    const id = `notification_${Date.now()}`
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("notifications").insert([newNotification]).select().single()

    if (error) {
      console.error("알림 추가 오류:", error)
      throw new Error("알림을 추가하는 중 오류가 발생했습니다.")
    }

    return data as Notification
  } catch (err) {
    console.error("알림 추가 중 오류 발생:", err)
    throw err
  }
}

// 알림 읽음 표시
export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("notifications").update({ read: true }).eq("id", id)

    if (error) {
      console.error("알림 읽음 표시 오류:", error)
      throw new Error("알림을 읽음 표시하는 중 오류가 발생했습니다.")
    }
  } catch (err) {
    console.error("알림 읽음 표시 중 오류 발생:", err)
    throw err
  }
}

// 모든 알림 읽음 표시
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("notifications").update({ read: true }).eq("user_id", userId)

    if (error) {
      console.error("모든 알림 읽음 표시 오류:", error)
      throw new Error("모든 알림을 읽음 표시하는 중 오류가 발생했습니다.")
    }
  } catch (err) {
    console.error("모든 알림 읽음 표시 중 오류 발생:", err)
    throw err
  }
}

// 일일 학습 성찰 관련 함수 추가

// 일일 학습 성찰 추가
export async function addDailyReflection(
  reflection: Omit<DailyReflection, "id" | "created_at" | "updated_at">,
): Promise<DailyReflection> {
  try {
    const id = `reflection_${Date.now()}`
    const now = new Date().toISOString()

    const newReflection = {
      id,
      ...reflection,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .upsert([newReflection], { onConflict: "student_id, reflection_date" })
      .select()
      .single()

    if (error) {
      console.error("일일 학습 성찰 추가 오류:", error)
      throw new Error("일일 학습 성찰을 추가하는 중 오류가 발생했습니다.")
    }
    console.error("일일 학습 성찰 추가 오류:", error)
    throw new Error("일일 학습 성찰을 추가하는 중 오류가 발생했습니다.")

    return data as DailyReflection
  } catch (err) {
    console.error("일일 학습 성찰 추가 중 오류 발생:", err)
    throw err
  }
}

// 학생별 일일 학습 성찰 조회
export async function getReflectionsByStudent(
  studentId: string,
  startDate?: string,
  endDate?: string,
): Promise<DailyReflection[]> {
  try {
    let query = supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .order("reflection_date", { ascending: false })

    if (startDate) {
      query = query.gte("reflection_date", startDate)
    }

    if (endDate) {
      query = query.lte("reflection_date", endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error("학습 성찰 조회 오류:", error)
      return []
    }

    return data as DailyReflection[]
  } catch (err) {
    console.error("학습 성찰 조회 중 오류 발생:", err)
    return []
  }
}

// 특정 날짜의 학습 성찰 조회
export async function getReflectionByDate(studentId: string, date: string): Promise<DailyReflection | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .eq("reflection_date", date)
      .single()

    if (error) {
      return null
    }

    return data as DailyReflection
  } catch (err) {
    console.error("특정 날짜 학습 성찰 조회 중 오류 발생:", err)
    return null
  }
}

// 모든 성찰 조회 (관리자용)
export async function getAllReflections(): Promise<DailyReflection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("모든 성찰 조회 오류:", error)
      return []
    }

    return data as DailyReflection[]
  } catch (err) {
    console.error("모든 성찰 조회 중 오류 발생:", err)
    return []
  }
}

// 최근 성찰 조회
export async function getRecentReflections(limit = 5): Promise<DailyReflection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("최근 성찰 조회 오류:", error)
      return []
    }

    return data as DailyReflection[]
  } catch (err) {
    console.error("최근 성찰 조회 중 오류 발생:", err)
    return []
  }
}

// 학생별 과제 조회 (타입 명확화)
export async function getStudentAssignments(studentId: string): Promise<Assignment[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("assignments")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("학생별 과제 조회 오류:", error)
      return []
    }

    return data as Assignment[]
  } catch (err) {
    console.error("학생별 과제 조회 중 오류 발생:", err)
    return []
  }
}

// 학생별 성적 조회 (타입 명확화)
export async function getStudentGrades(studentId: string): Promise<Grade[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("grades")
      .select("*")
      .eq("student_id", studentId)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("학생별 성적 조회 오류:", error)
      return []
    }

    return data as Grade[]
  } catch (err) {
    console.error("학생별 성적 조회 중 오류 발생:", err)
    return []
  }
}

// 학생별 학습 로그 조회 (타입 명확화)
export async function getStudentStudyLogs(studentId: string): Promise<StudyLog[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("study_logs")
      .select("*")
      .eq("student_id", studentId)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("학생별 학습 로그 조회 오류:", error)
      return []
    }

    return data as StudyLog[]
  } catch (err) {
    console.error("학생별 학습 로그 조회 중 오류 발생:", err)
    return []
  }
}

// 학생별 성찰 조회 (타입 명확화)
export async function getStudentReflections(studentId: string): Promise<DailyReflection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .order("reflection_date", { ascending: false })

    if (error) {
      console.error("학생별 성찰 조회 오류:", error)
      return []
    }

    return data as DailyReflection[]
  } catch (err) {
    console.error("학생별 성찰 조회 중 오류 발생:", err)
    return []
  }
}
