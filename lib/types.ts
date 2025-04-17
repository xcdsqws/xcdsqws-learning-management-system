export interface User {
  id: string
  name: string
  role: "student" | "admin" | "parent"
  grade?: number
  class?: number
  number?: number
  child_id?: string // 학부모 계정의 경우 자녀 ID
  created_at: string
  password?: string // 비밀번호는 선택적 필드 (반환 시 제외)
}

// 학생 타입 명확화
export interface Student {
  id: string
  name: string
  grade?: number
  class?: number
  number?: number
  created_at: string
}

export interface Subject {
  id: string
  name: string
  category?: string // 과목 카테고리 추가
  description?: string // 과목 설명 추가
}

export interface Assignment {
  id: string
  student_id: string
  subject_id: string
  title: string
  description: string
  due_date: string
  status: "pending" | "completed" | "late"
  created_at: string
  completed_at?: string // 완료 시간 추가
  feedback?: string // 피드백 추가
}

export interface StudyLog {
  id: string
  student_id: string
  subject_id: string
  duration: number // 분 단위
  content: string
  timestamp: string
}

export interface Grade {
  id: string
  student_id: string
  subject_id: string
  test_name: string
  score: number
  max_score: number
  timestamp: string
  feedback?: string // 피드백 추가
}

export interface Report {
  id: string
  student_id: string
  total_study_time: number // 분 단위
  subject_study_time: Record<string, number> // 과목별 학습 시간 (분 단위)
  average_grade: number // 백분율
  timestamp: string
  // 추가된 필드
  average_self_rating?: number // 평균 자기평가 점수
  reflection_summary?: string // 성찰 내용 요약
  reflection_count?: number // 성찰 기록 수
}

export interface StudyGoal {
  id: string
  student_id: string
  subject_id: string
  target_minutes: number // 목표 시간 (분 단위)
  period: "daily" | "weekly" | "monthly" // 목표 기간
  created_at: string
  updated_at: string
  achieved?: boolean // 달성 여부 추가
  progress?: number // 진행률 추가 (0-100%)
}

export interface StudyStatistics {
  totalTime: number // 총 학습 시간 (분 단위)
  subjectTime: Record<string, number> // 과목별 학습 시간 (분 단위)
  dailyTime: Record<string, number> // 일별 학습 시간 (분 단위)
  weeklyTime: Record<string, number> // 주별 학습 시간 (분 단위)
  monthlyTime: Record<string, number> // 월별 학습 시간 (분 단위)
  hourlyDistribution: Record<string, number> // 시간대별 분포 (분 단위)
  dayOfWeekDistribution: Record<string, number> // 요일별 분포 (분 단위)
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "assignment" | "grade" | "goal" | "system" | "reflection" // reflection 타입 추가
  read: boolean
  link?: string
  timestamp: string
  priority?: "low" | "medium" | "high" // 우선순위 추가
}

export interface DailyReflection {
  id: string
  student_id: string
  reflection_date: string
  content: string
  self_rating: number
  created_at: string
  updated_at: string
  mood?: string // 기분 추가
  goals_achieved?: boolean // 목표 달성 여부 추가
  challenges?: string // 어려웠던 점 추가
}

// 시스템 상태 인터페이스 추가
export interface SystemStatus {
  database: boolean
  storage: boolean
  auth: boolean
  lastChecked: string
  version: string
  uptime: number
}

// 사용자 설정 인터페이스 추가
export interface UserSettings {
  user_id: string
  theme: "light" | "dark" | "system"
  notifications_enabled: boolean
  email_notifications: boolean
  language: string
  created_at: string
  updated_at: string
}
