import { useId } from 'react'

import { cn } from '@/lib/utils'

import { Checkbox } from '../checkbox'
import { Label } from '../label'

type PermissionCardProps = {
  label: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export default function PermissionCard({
  label,
  description,
  checked,
  onCheckedChange,
  className,
}: PermissionCardProps) {
  const id = useId()

  return (
    <div
      className={cn(
        'group relative flex w-full cursor-pointer items-start justify-between gap-4 rounded-xl border border-input p-4 transition-all duration-200 hover:shadow-md',
        checked
          ? 'border-primary/50 bg-primary/5 shadow-sm'
          : 'bg-card hover:border-primary/30 hover:bg-accent/50',
        className,
      )}
    >
      <Label htmlFor={id} className="flex-1 cursor-pointer select-none">
        <div className="grid gap-1">
          <span
            className={cn(
              'text-sm font-semibold transition-colors',
              checked ? 'text-primary' : 'text-foreground',
            )}
          >
            {label}
          </span>
          {description && (
            <p
              id={`${id}-description`}
              className="text-xs text-muted-foreground line-clamp-2"
            >
              {description}
            </p>
          )}
        </div>
      </Label>

      <div className="flex items-center self-start pt-1">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-describedby={description ? `${id}-description` : undefined}
          className="h-5 w-5 transition-transform group-hover:scale-110"
        />
      </div>
    </div>
  )
}
