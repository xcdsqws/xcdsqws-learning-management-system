"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateAccountForm from "./create-account-form"
import AccountList from "./account-list"

export default function AccountManagement() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // 계정 생성 후 목록 새로고침
  const handleAccountCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <Tabs defaultValue="list">
      <TabsList className="mb-4">
        <TabsTrigger value="list">계정 목록</TabsTrigger>
        <TabsTrigger value="create">계정 생성</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <AccountList key={refreshTrigger} />
      </TabsContent>

      <TabsContent value="create">
        <CreateAccountForm onAccountCreated={handleAccountCreated} />
      </TabsContent>
    </Tabs>
  )
}
