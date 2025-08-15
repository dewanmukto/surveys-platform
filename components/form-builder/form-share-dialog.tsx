"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from "@iconify/react"
import type { Form } from "@/lib/forms"

interface FormShareDialogProps {
  form: Form
  children: React.ReactNode
}

export function FormShareDialog({ form, children }: FormShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const formUrl = `${window.location.origin}/forms/${form.id}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold">Share Form</DialogTitle>
          <DialogDescription>
            Share this form with others using the link below. Only published forms can be accessed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-url">Form URL</Label>
            <div className="flex gap-2">
              <Input id="form-url" value={formUrl} readOnly className="glass" />
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? (
                  <Icon icon="solar:check-circle-bold-duotone" className="w-4 h-4" />
                ) : (
                  <Icon icon="solar:copy-bold-duotone" className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
            <Icon
              icon={form.isPublished ? "solar:eye-bold-duotone" : "solar:eye-closed-bold-duotone"}
              className={`w-4 h-4 ${form.isPublished ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className="text-sm">
              {form.isPublished ? "Form is published and accessible" : "Form is not published"}
            </span>
          </div>

          {copied && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Icon icon="solar:check-circle-bold-duotone" className="w-4 h-4" />
              Link copied to clipboard!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
