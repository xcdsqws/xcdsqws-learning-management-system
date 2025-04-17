"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "./supabase"
import bcryptjs from "bcryptjs" // bcrypt에서 bcryptjs로 변경
import type { User } from "./types"

// 현재 사용자 정보 가져오기
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  try {
    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("id", session.id).single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error)
    return null
  }
}

// 로그인 처리
export async function login(formData: FormData) {
  const id = formData.get("id") as string
  const password = formData.get("password") as string

  try {
    // 사용자 정보 조회
    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

    if (error || !user) {
      return { error: "아이디 또는 비밀번호가 일치하지 않습니다." }
    }

    // 비밀번호 검증
    const passwordMatch = await bcryptjs.compare(password, user.password)

    if (!passwordMatch) {
      return { error: "아이디 또는 비밀번호가 일치하지 않습니다." }
    }

    // 세션 쿠키 설정
    const session = {
      id: user.id,
      name: user.name,
      role: user.role,
      grade: user.grade,
      class: user.class,
      number: user.number,
      child_id: user.child_id,
    }

    // 쿠키에 세션 저장 (7일 유효)
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    })

    // 역할에 따라 리다이렉트
    if (user.role === "admin") {
      redirect("/admin")
    } else if (user.role === "parent") {
      redirect("/parent")
    } else {
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("로그인 오류:", error)
    return { error: "로그인 처리 중 오류가 발생했습니다." }
  }
}

// 로그아웃 처리
export async function logout() {
  // 세션 쿠키 삭제
  cookies().delete("session")
  redirect("/")
}

// 현재 세션 정보 가져오기
export async function getSession() {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch (error) {
    console.error("세션 파싱 오류:", error)
    return null
  }
}

// 인증 필요한 페이지에서 세션 확인
export async function checkAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return session
}

// 관리자 권한 확인
export async function checkAdmin() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/")
  }

  return session
}

// 학부모 권한 확인
export async function checkParent() {
  const session = await getSession()

  if (!session || session.role !== "parent") {
    redirect("/")
  }

  return session
}

// 학생 권한 확인
export async function checkStudent() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/")
  }

  return session
}

// 비밀번호 변경
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // 현재 사용자 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("password")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return { error: "사용자를 찾을 수 없습니다." }
    }

    // 현재 비밀번호 검증
    const passwordMatch = await bcryptjs.compare(currentPassword, user.password)

    if (!passwordMatch) {
      return { error: "현재 비밀번호가 일치하지 않습니다." }
    }

    // 새 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(newPassword, 10)

    // 비밀번호 업데이트
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", userId)

    if (updateError) {
      return { error: "비밀번호 변경 중 오류가 발생했습니다." }
    }

    return { success: true }
  } catch (error) {
    console.error("비밀번호 변경 오류:", error)
    return { error: "비밀번호 변경 중 오류가 발생했습니다." }
  }
}
