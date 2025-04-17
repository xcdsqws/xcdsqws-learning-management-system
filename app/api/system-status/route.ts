import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // 데이터베이스 연결 확인
    const { data: dbTest, error: dbError } = await supabaseAdmin.from("users").select("count").limit(1)

    // 환경 변수 확인
    const envStatus = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    // 테이블 존재 여부 확인
    const tables = [
      "users",
      "subjects",
      "study_logs",
      "assignments",
      "grades",
      "reports",
      "notifications",
      "daily_reflections",
    ]
    const tableStatus: Record<string, boolean> = {}

    for (const table of tables) {
      const { data, error } = await supabaseAdmin.from(table).select("count").limit(1)
      tableStatus[table] = !error
    }

    // 관리자 계정 존재 여부 확인
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from("users")
      .select("count")
      .eq("role", "admin")
      .limit(1)

    const hasAdmin = adminData && adminData.length > 0 && adminData[0].count > 0

    return NextResponse.json({
      status: "ok",
      database: !dbError,
      environment: envStatus,
      tables: tableStatus,
      hasAdmin,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("시스템 상태 확인 오류:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "시스템 상태 확인 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
