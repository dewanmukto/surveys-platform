"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icon } from "@iconify/react"

interface CreateFormDialogProps {
  onCreateForm: (title: string, description: string) => Promise<void>
  children: React.ReactNode
}

export function CreateFormDialog({ onCreateForm, children }: CreateFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      await onCreateForm(title, description)
      setTitle("")
      setDescription("")
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold">Create New Form</DialogTitle>
          <DialogDescription>Give your form a name and description to get started.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="glass" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? (
                <Icon icon="solar:refresh-bold-duotone" className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
              )}
              Create Form
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
