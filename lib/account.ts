"use server"

import { supabaseAdmin } from "./supabase"
import bcrypt from "bcrypt"

// 학생 계정 생성
export async function createAccount(data: {
  id?: string
  password?: string
  name: string
  grade?: number
  class?: number
  number?: number
}) {
  try {
    // ID가 없으면 자동 생성
    const id = data.id || `student_${Date.now()}`

    // 비밀번호가 없으면 랜덤 생성
    const password = data.password || generateRandomPassword()

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10)

    const newAccount = {
      id,
      password: hashedPassword,
      name: data.name,
      role: "student",
      grade: data.grade,
      class: data.class,
      number: data.number,
      created_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabaseAdmin.from("users").insert([newAccount]).select("id, name").single()

    if (error) {
      console.error("계정 생성 오류:", error)
      throw new Error(error.message)
    }

    // 원본 비밀번호 반환 (클라이언트에 표시용)
    return { ...result, password }
  } catch (error) {
    console.error("계정 생성 중 오류 발생:", error)
    throw error
  }
}

// 학생 계정 목록 조회
export async function getStudentAccounts() {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, name, grade, class, number, created_at")
      .eq("role", "student")
      .order("grade")
      .order("class")
      .order("number")

    if (error) {
      console.error("계정 목록 조회 오류:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("계정 목록 조회 중 오류 발생:", error)
    throw error
  }
}

// 계정 삭제
export async function deleteAccount(id: string) {
  try {
    // 계정과 관련된 모든 데이터 삭제
    await Promise.all([
      // 학습 로그 삭제
      supabaseAdmin
        .from("study_logs")
        .delete()
        .eq("student_id", id),
      // 과제 삭제
      supabaseAdmin
        .from("assignments")
        .delete()
        .eq("student_id", id),
      // 성적 삭제
      supabaseAdmin
        .from("grades")
        .delete()
        .eq("student_id", id),
      // 학습 목표 삭제
      supabaseAdmin
        .from("study_goals")
        .delete()
        .eq("student_id", id),
      // 리포트 삭제
      supabaseAdmin
        .from("reports")
        .delete()
        .eq("student_id", id),
      // 알림 삭제
      supabaseAdmin
        .from("notifications")
        .delete()
        .eq("user_id", id),
      // 일일 성찰 삭제
      supabaseAdmin
        .from("daily_reflections")
        .delete()
        .eq("student_id", id),
    ])

    // 학부모 계정 연결 해제
    await supabaseAdmin.from("users").update({ child_id: null }).eq("child_id", id)

    // 계정 삭제
    const { error } = await supabaseAdmin.from("users").delete().eq("id", id)

    if (error) {
      console.error("계정 삭제 오류:", error)
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("계정 삭제 중 오류 발생:", error)
    throw error
  }
}

// 비밀번호 초기화
export async function resetPassword(id: string) {
  try {
    // 새 비밀번호 생성
    const newPassword = generateRandomPassword()

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 비밀번호 업데이트
    const { error } = await supabaseAdmin.from("users").update({ password: hashedPassword }).eq("id", id)

    if (error) {
      console.error("비밀번호 초기화 오류:", error)
      throw new Error(error.message)
    }

    return { id, password: newPassword }
  } catch (error) {
    console.error("비밀번호 초기화 중 오류 발생:", error)
    throw error
  }
}

// 계정 일괄 생성
export async function bulkCreateAccounts(accounts: { name: string; grade: number; class: number; number: number }[]) {
  try {
    const results = []

    for (const account of accounts) {
      // ID 생성 (학년-반-번호 형식)
      const id = `s${account.grade}${account.class.toString().padStart(2, "0")}${account.number.toString().padStart(2, "0")}`

      // 비밀번호 생성 (초기 비밀번호는 ID와 동일)
      const password = id

      // 계정 생성
      const result = await createAccount({
        id,
        password,
        name: account.name,
        grade: account.grade,
        class: account.class,
        number: account.number,
      })

      results.push(result)
    }

    return results
  } catch (error) {
    console.error("계정 일괄 생성 중 오류 발생:", error)
    throw error
  }
}

// 랜덤 비밀번호 생성
function generateRandomPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let result = ""
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 계정 정보 업데이트
export async function updateAccount(
  id: string,
  data: {
    name?: string
    grade?: number
    class?: number
    number?: number
  },
) {
  try {
    const { error } = await supabaseAdmin.from("users").update(data).eq("id", id)

    if (error) {
      console.error("계정 정보 업데이트 오류:", error)
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("계정 정보 업데이트 중 오류 발생:", error)
    throw error
  }
}

// 계정 검색
export async function searchAccounts(query: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, name, grade, class, number, role, created_at")
      .or(`name.ilike.%${query}%,id.ilike.%${query}%`)
      .order("role")
      .order("grade")
      .order("class")
      .order("number")

    if (error) {
      console.error("계정 검색 오류:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("계정 검색 중 오류 발생:", error)
    throw error
  }
}
