"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/types"
import { Search, UserX } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface StudentWithParents extends User {
  parents: User[]
}

interface ParentListProps {
  studentsWithParents: StudentWithParents[]
}

export default function ParentList({ studentsWithParents }: ParentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 학생 이름으로 검색
  const filteredStudents = studentsWithParents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parents.some((parent) => parent.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 학부모 계정 삭제 처리
  const handleDeleteParent = async () => {
    if (!selectedParent) return

    setIsDeleting(true)

    try {
      // 실제 삭제 로직 구현 (API 호출 등)
      // await deleteParentAccount(selectedParent.id)

      // 성공 메시지 표시
      alert("학부모 계정이 삭제되었습니다.")

      // 페이지 새로고침
      window.location.reload()
    } catch (error) {
      console.error("학부모 계정 삭제 오류:", error)
      alert("학부모 계정 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  // 삭제 다이얼로그 열기
  const openDeleteDialog = (parent: User) => {
    setSelectedParent(parent)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="학생 또는 학부모 이름으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>학생 정보</TableHead>
              <TableHead>학부모 계정</TableHead>
              <TableHead>계정 생성일</TableHead>
              <TableHead className="w-[100px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) =>
              student.parents.length > 0 ? (
                student.parents.map((parent, index) => (
                  <TableRow key={parent.id}>
                    {index === 0 ? (
                      <TableCell rowSpan={student.parents.length} className="align-top">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.grade}학년 {student.class}반 {student.number}번
                        </div>
                        <div className="text-xs text-muted-foreground">{student.id}</div>
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <div className="font-medium">{parent.name}</div>
                      <div className="text-sm text-muted-foreground">{parent.id}</div>
                    </TableCell>
                    <TableCell>{parent.created_at ? new Date(parent.created_at).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(parent)}>
                        <UserX className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {student.grade}학년 {student.class}반 {student.number}번
                    </div>
                  </TableCell>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    등록된 학부모 계정 없음
                  </TableCell>
                </TableRow>
              ),
            )}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학부모 계정 삭제</DialogTitle>
            <DialogDescription>
              {selectedParent?.name} 학부모 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteParent} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
