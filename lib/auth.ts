"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserById } from "./db"
import type { User } from "./types"

// 로그인 함수
export async function login(username: string, password: string) {
  try {
    const { getUser } = await import("./db")
    const user = await getUser(username, password)

    if (user) {
      // 세션 쿠키 설정 (24시간 유효)
      cookies().set("userId", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      })

      return {
        success: true,
        isAdmin: user.role === "admin",
        isParent: user.role === "parent",
      }
    }

    return { success: false }
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error)
    return { success: false, error: "로그인 처리 중 오류가 발생했습니다." }
  }
}

// 로그아웃 함수
export async function logout() {
  try {
    cookies().delete("userId")
    redirect("/")
  } catch (error) {
    console.error("로그아웃 처리 중 오류 발생:", error)
    redirect("/")
  }
}

// 현재 로그인한 사용자 정보 가져오기
export async function getCurrentUser(): Promise<User | null> {
  try {
    const userId = cookies().get("userId")?.value

    if (!userId) {
      return null
    }

    return getUserById(userId)
  } catch (error) {
    console.error("현재 사용자 정보 조회 중 오류 발생:", error)
    return null
  }
}

// 인증 확인 함수
export async function checkAuth() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      redirect("/")
    }

    return user
  } catch (error) {
    console.error("인증 확인 중 오류 발생:", error)
    redirect("/")
  }
}

// 관리자 권한 확인 함수
export async function checkAdmin() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      redirect("/")
    }

    return user
  } catch (error) {
    console.error("관리자 권한 확인 중 오류 발생:", error)
    redirect("/")
  }
}

// 학부모 권한 확인 함수
export async function checkParent() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "parent") {
      redirect("/")
    }

    return user
  } catch (error) {
    console.error("학부모 권한 확인 중 오류 발생:", error)
    redirect("/")
  }
}

// 학생 권한 확인 함수
export async function checkStudent() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "student") {
      redirect("/")
    }

    return user
  } catch (error) {
    console.error("학생 권한 확인 중 오류 발생:", error)
    redirect("/")
  }
}

// 세션 유효성 확인 함수
export async function isSessionValid(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user !== null
  } catch (error) {
    console.error("세션 유효성 확인 중 오류 발생:", error)
    return false
  }
}
