import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import bcryptjs from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { id, password, name } = await request.json()

    // 필수 필드 확인
    if (!id || !name || !password) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 })
    }

    // 이미 존재하는 계정인지 확인
    const { data: existingAccount } = await supabaseAdmin.from("users").select("id").eq("id", id).single()

    if (existingAccount) {
      return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 400 })
    }

    // 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(password, 10)

    // 계정 생성
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          id,
          password: hashedPassword,
          name,
          role: "admin",
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error("관리자 계정 생성 오류:", error)
      return NextResponse.json({ error: "계정을 생성하는 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({ id: data.id, success: true })
  } catch (error: any) {
    console.error("관리자 계정 생성 오류:", error)
    return NextResponse.json({ error: error.message || "계정을 생성하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}
