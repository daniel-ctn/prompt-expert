'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { deleteAccount, exportAccountData } from '@/lib/actions/account'

export function AccountDataSection() {
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const data = await exportAccountData()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `prompt-expert-export-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast.success('Account data exported')
    } catch {
      toast.error('Failed to export account data')
    } finally {
      setExporting(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await deleteAccount()
      await signOut({ callbackUrl: '/' })
    } catch {
      toast.error('Failed to delete account')
      setDeleting(false)
    }
  }

  return (
    <>
      <Card className="bg-background/84">
        <CardHeader>
          <CardTitle>Account data</CardTitle>
          <CardDescription className="leading-6">
            Export your prompts, prompt history, public prompt metadata, API
            token metadata, and provider key metadata. Provider key secrets are
            never included in exports.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export data'}
          </Button>
          <Button
            variant="outline"
            className="text-destructive rounded-full"
            onClick={() => setConfirmDeleteOpen(true)}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your account, saved prompts, prompt
              history, API tokens, and provider keys. Public prompts owned by
              this account will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
