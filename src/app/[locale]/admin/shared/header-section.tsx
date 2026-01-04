'use client'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export interface HeaderSectionProps {
  title?: string
  btnLabel?: string
  showBackButton?: boolean
  onBack?: () => void
  onSubmit?: () => void
}

export default function HeaderSection({
  title = 'Admin Panel',
  btnLabel = 'New Item',
  showBackButton = false,
  onBack,
  onSubmit,
}: HeaderSectionProps) {
  const router = useRouter()
  const onBackDefault = () => {
    router.back()
  }

  return (
    <header className="p-3 border-b border-input">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack || onBackDefault}
            >
              <ChevronLeft />
            </Button>
          )}
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        <Button variant="default" onClick={onSubmit}>
          {btnLabel}
        </Button>
      </div>
    </header>
  )
}
