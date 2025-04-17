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
export async function addStudyLog(
  studentId: string,
  subjectId: number,
  duration: number,
  content: string,
  date: string,
): Promise<StudyLog | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("study_logs")
      .insert([
        {
          student_id: studentId,
          subject_id: subjectId,
          duration,
          content,
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
export async function addAssignment(
  studentId: string,
  subjectId: number,
  title: string,
  description: string,
  dueDate: string,
): Promise<Assignment | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("assignments")
      .insert([
        {
          student_id: studentId,
          subject_id: subjectId,
          title,
          description,
          due_date: dueDate,
          status: "pending",
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
export async function updateAssignmentStatus(id: number, status: "pending" | "completed"): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("assignments").update({ status }).eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("과제 상태 업데이트 오류:", error)
    return false
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
export async function generateReport(studentId: string, period: "weekly" | "monthly"): Promise<Report | null> {
  try {
    // 기간 설정
    const now = new Date()
    let startDate: Date
    const endDate = now

    if (period === "weekly") {
      // 일주일 전
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else {
      // 한 달 전
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    }

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
    const subjectStudyTime: Record<number, number> = {}
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
    const report: Report = {
      id: 0, // 데이터베이스에서 자동 생성
      student_id: studentId,
      period,
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

// 학습 목표 추가
export async function addStudyGoal(
  studentId: string,
  subjectId: number,
  description: string,
  targetHours: number,
  deadline: string,
): Promise<StudyGoal | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("study_goals")
      .insert([
        {
          student_id: studentId,
          subject_id: subjectId,
          description,
          target_hours: targetHours,
          current_hours: 0,
          deadline,
          completed: false,
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
    console.error("학습 목표 추가 오류:", error)
    return null
  }
}

// 학습 목표 업데이트
export async function updateStudyGoal(id: number, currentHours: number, completed: boolean): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("study_goals")
      .update({ current_hours: currentHours, completed })
      .eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("학습 목표 업데이트 오류:", error)
    return false
  }
}

// 학습 목표 삭제
export async function deleteStudyGoal(id: number): Promise<boolean> {
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
export async function addDailyReflection(
  studentId: string,
  content: string,
  selfRating: number,
  date: string,
): Promise<DailyReflection | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_reflections")
      .insert([
        {
          student_id: studentId,
          content,
          self_rating: selfRating,
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

// 일일 성찰 삭제
export async function deleteDailyReflection(id: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("daily_reflections").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("일일 성찰 삭제 오류:", error)
    return false
  }
}

// 학생 목록 조회
export async function getStudents(): Promise<User[]> {
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
export async function getStudentDetail(id: string): Promise<{
  user: User | null
  studyLogs: StudyLog[]
  assignments: Assignment[]
  grades: Grade[]
  reflections: DailyReflection[]
}> {
  try {
    // 학생 정보 조회
    const { data: user, error: userError } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

    if (userError) {
      throw userError
    }

    // 학습 로그 조회
    const { data: studyLogs, error: studyLogsError } = await supabaseAdmin
      .from("study_logs")
      .select("*, subject:subjects(name)")
      .eq("student_id", id)
      .order("date", { ascending: false })
      .limit(10)

    if (studyLogsError) {
      throw studyLogsError
    }

    // 과제 조회
    const { data: assignments, error: assignmentsError } = await supabaseAdmin
      .from("assignments")
      .select("*, subject:subjects(name)")
      .eq("student_id", id)
      .order("due_date", { ascending: true })
      .limit(10)

    if (assignmentsError) {
      throw assignmentsError
    }

    // 성적 조회
    const { data: grades, error: gradesError } = await supabaseAdmin
      .from("grades")
      .select("*, subject:subjects(name)")
      .eq("student_id", id)
      .order("date", { ascending: false })
      .limit(10)

    if (gradesError) {
      throw gradesError
    }

    // 일일 성찰 조회
    const { data: reflections, error: reflectionsError } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", id)
      .order("date", { ascending: false })
      .limit(10)

    if (reflectionsError) {
      throw reflectionsError
    }

    return {
      user,
      studyLogs: studyLogs || [],
      assignments: assignments || [],
      grades: grades || [],
      reflections: reflections || [],
    }
  } catch (error) {
    console.error("학생 상세 정보 조회 오류:", error)
    return {
      user: null,
      studyLogs: [],
      assignments: [],
      grades: [],
      reflections: [],
    }
  }
}

// 학부모 목록 조회
export async function getParents(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("role", "parent").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("학부모 목록 조회 오류:", error)
    return []
  }
}

// 학부모 계정 생성
export async function createParentAccount(name: string, childId: string): Promise<User | null> {
  try {
    // 자녀 정보 조회
    const { data: child, error: childError } = await supabaseAdmin.from("users").select("*").eq("id", childId).single()

    if (childError || !child) {
      throw new Error("자녀 정보를 찾을 수 없습니다.")
    }

    // ID 생성 (p_ + 자녀 ID)
    const id = `p_${childId}`

    // 비밀번호 생성 (초기 비밀번호는 ID와 동일)
    const password = id
    const hashedPassword = await bcryptjs.hash(password, 10)

    // 계정 생성
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          id,
          password: hashedPassword,
          name,
          role: "parent",
          child_id: childId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return { ...data, password }
  } catch (error) {
    console.error("학부모 계정 생성 오류:", error)
    return null
  }
}

// 학부모 계정 삭제
export async function deleteParentAccount(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("users").delete().eq("id", id).eq("role", "parent")

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("학부모 계정 삭제 오류:", error)
    return false
  }
}

// 자녀 정보 조회 (학부모용)
export async function getChildInfo(childId: string): Promise<{
  user: User | null
  studyLogs: StudyLog[]
  assignments: Assignment[]
  grades: Grade[]
  reports: Report[]
  reflections: DailyReflection[]
}> {
  try {
    // 자녀 정보 조회
    const { data: user, error: userError } = await supabaseAdmin.from("users").select("*").eq("id", childId).single()

    if (userError || !user) {
      throw new Error("자녀 정보를 찾을 수 없습니다.")
    }

    // 학습 로그 조회
    const { data: studyLogs, error: studyLogsError } = await supabaseAdmin
      .from("study_logs")
      .select("*, subject:subjects(name)")
      .eq("student_id", childId)
      .order("date", { ascending: false })
      .limit(10)

    if (studyLogsError) {
      throw studyLogsError
    }

    // 과제 조회
    const { data: assignments, error: assignmentsError } = await supabaseAdmin
      .from("assignments")
      .select("*, subject:subjects(name)")
      .eq("student_id", childId)
      .order("due_date", { ascending: true })

    if (assignmentsError) {
      throw assignmentsError
    }

    // 성적 조회
    const { data: grades, error: gradesError } = await supabaseAdmin
      .from("grades")
      .select("*, subject:subjects(name)")
      .eq("student_id", childId)
      .order("date", { ascending: false })

    if (gradesError) {
      throw gradesError
    }

    // 보고서 조회
    const { data: reports, error: reportsError } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("student_id", childId)
      .order("created_at", { ascending: false })

    if (reportsError) {
      throw reportsError
    }

    // 일일 성찰 조회
    const { data: reflections, error: reflectionsError } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", childId)
      .order("date", { ascending: false })

    if (reflectionsError) {
      throw reflectionsError
    }

    return {
      user,
      studyLogs: studyLogs || [],
      assignments: assignments || [],
      grades: grades || [],
      reports: reports || [],
      reflections: reflections || [],
    }
  } catch (error) {
    console.error("자녀 정보 조회 오류:", error)
    return {
      user: null,
      studyLogs: [],
      assignments: [],
      grades: [],
      reports: [],
      reflections: [],
    }
  }
}

// 데이터 내보내기
export async function exportData(studentId: string): Promise<{
  user: User | null
  studyLogs: StudyLog[]
  assignments: Assignment[]
  grades: Grade[]
  reports: Report[]
  reflections: DailyReflection[]
}> {
  try {
    // 학생 정보 조회
    const { data: user, error: userError } = await supabaseAdmin.from("users").select("*").eq("id", studentId).single()

    if (userError) {
      throw userError
    }

    // 학습 로그 조회
    const { data: studyLogs, error: studyLogsError } = await supabaseAdmin
      .from("study_logs")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (studyLogsError) {
      throw studyLogsError
    }

    // 과제 조회
    const { data: assignments, error: assignmentsError } = await supabaseAdmin
      .from("assignments")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("due_date", { ascending: true })

    if (assignmentsError) {
      throw assignmentsError
    }

    // 성적 조회
    const { data: grades, error: gradesError } = await supabaseAdmin
      .from("grades")
      .select("*, subject:subjects(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (gradesError) {
      throw gradesError
    }

    // 보고서 조회
    const { data: reports, error: reportsError } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })

    if (reportsError) {
      throw reportsError
    }

    // 일일 성찰 조회
    const { data: reflections, error: reflectionsError } = await supabaseAdmin
      .from("daily_reflections")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })

    if (reflectionsError) {
      throw reflectionsError
    }

    return {
      user,
      studyLogs: studyLogs || [],
      assignments: assignments || [],
      grades: grades || [],
      reports: reports || [],
      reflections: reflections || [],
    }
  } catch (error) {
    console.error("데이터 내보내기 오류:", error)
    return {
      user: null,
      studyLogs: [],
      assignments: [],
      grades: [],
      reports: [],
      reflections: [],
    }
  }
}
