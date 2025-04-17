"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getStudentAccounts, deleteAccount, resetPassword } from "@/lib/account"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, RefreshCw, Copy, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Account {
  id: string
  name: string
  grade?: number
  class?: number
  number?: number
  created_at: string
}

export default function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [resetPasswordResult, setResetPasswordResult] = useState<{ id: string; password: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    setIsLoading(true)
    try {
      const data = await getStudentAccounts()
      setAccounts(data)
    } catch (error) {
      console.error("계정 목록 로딩 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id)
      setAccounts(accounts.filter((account) => account.id !== id))
      toast({
        title: "계정 삭제 완료",
        description: `계정 ${id}가 삭제되었습니다.`,
      })
    } catch (error) {
      console.error("계정 삭제 오류:", error)
      toast({
        title: "계정 삭제 오류",
        description: "계정을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async (id: string) => {
    try {
      const result = await resetPassword(id)
      setResetPasswordResult(result)
    } catch (error) {
      console.error("비밀번호 초기화 오류:", error)
      toast({
        title: "비밀번호 초기화 오류",
        description: "비밀번호를 초기화하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "복사 완료",
      description: "클립보드에 복사되었습니다.",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const filteredAccounts = accounts.filter(
    (account) =>
      account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>학생 계정 목록</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="이름 또는 아이디 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" onClick={loadAccounts} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {resetPasswordResult && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">비밀번호가 초기화되었습니다</p>
                <p>
                  아이디: {resetPasswordResult.id}, 새 비밀번호: {resetPasswordResult.password}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(`아이디: ${resetPasswordResult.id}, 비밀번호: ${resetPasswordResult.password}`)
                }
              >
                <Copy className="h-4 w-4 mr-2" />
                복사
              </Button>
            </div>
          </div>
        )}

        {accounts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">등록된 학생 계정이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>아이디</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>학년</TableHead>
                  <TableHead>반</TableHead>
                  <TableHead>번호</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.grade}</TableCell>
                    <TableCell>{account.class}</TableCell>
                    <TableCell>{account.number}</TableCell>
                    <TableCell>{account.created_at ? formatDate(account.created_at) : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleResetPassword(account.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          비밀번호 초기화
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              삭제
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>계정 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                정말로 {account.name}({account.id}) 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며,
                                해당 학생의 모든 데이터가 삭제됩니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAccount(account.id)}>
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
