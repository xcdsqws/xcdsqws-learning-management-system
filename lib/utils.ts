import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// 클래스 이름 병합 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 형식 변환 (YYYY-MM-DD)
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  } catch (error) {
    console.error("날짜 형식 변환 오류:", error)
    return dateString
  }
}

// 시간 형식 변환 (분 -> 시간:분)
export function formatTime(minutes: number): string {
  try {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  } catch (error) {
    console.error("시간 형식 변환 오류:", error)
    return `${minutes}분`
  }
}

// 학습 시간 형식 변환 (분 -> 시간:분)
export function formatDuration(minutes: number): string {
  try {
    if (minutes < 60) {
      return `${minutes}분`
    }

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (mins === 0) {
      return `${hours}시간`
    }

    return `${hours}시간 ${mins}분`
  } catch (error) {
    console.error("학습 시간 형식 변환 오류:", error)
    return `${minutes}분`
  }
}

// 성적 백분율 계산
export function calculatePercentage(score: number, maxScore: number): number {
  try {
    if (maxScore === 0) return 0
    return Math.round((score / maxScore) * 100)
  } catch (error) {
    console.error("성적 백분율 계산 오류:", error)
    return 0
  }
}

// 평균 계산
export function calculateAverage(numbers: number[]): number {
  try {
    if (numbers.length === 0) return 0
    const sum = numbers.reduce((acc, val) => acc + val, 0)
    return Math.round((sum / numbers.length) * 10) / 10
  } catch (error) {
    console.error("평균 계산 오류:", error)
    return 0
  }
}

// 텍스트 자르기 (긴 텍스트 처리)
export function truncateText(text: string, maxLength: number): string {
  try {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  } catch (error) {
    console.error("텍스트 자르기 오류:", error)
    return text
  }
}

// 학년-반-번호 형식으로 변환
export function formatStudentInfo(grade?: number, classNum?: number, number?: number): string {
  try {
    const parts = []
    if (grade) parts.push(`${grade}학년`)
    if (classNum) parts.push(`${classNum}반`)
    if (number) parts.push(`${number}번`)

    return parts.join(" ")
  } catch (error) {
    console.error("학생 정보 형식 변환 오류:", error)
    return ""
  }
}

// 랜덤 ID 생성
export function generateRandomId(prefix: string): string {
  try {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  } catch (error) {
    console.error("랜덤 ID 생성 오류:", error)
    return `${prefix}_${Date.now()}`
  }
}

// 안전한 JSON 파싱
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.error("JSON 파싱 오류:", error)
    return fallback
  }
}

// 에러 메시지 포맷팅
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
