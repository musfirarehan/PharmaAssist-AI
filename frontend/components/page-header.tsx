"use client"

import type { ReactNode } from "react"
import { Bell, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type PageHeaderProps = {
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-1 h-6" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-foreground">
            {title}
          </h1>
          <p className="truncate text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="hidden md:block">
          <InputGroup className="w-64">
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search patients, medicines..." />
          </InputGroup>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
        </Button>
        <Avatar className="size-9">
          <AvatarImage src="/pharmacist-avatar.png" alt="Dr. Elena Rossi" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
