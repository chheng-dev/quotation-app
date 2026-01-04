import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader } from './card'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

function UserSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-2 px-2 py-1.5', className)}
      {...props}
    >
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

function CardSkeleton({
  fields = 3,
  className,
  ...props
}: { fields?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('space-y-3 p-4 border rounded-lg', className)}
      {...props}
    >
      {Array.from({ length: fields }).map((_, i) => {
        const widthClasses = ['w-3/4', 'w-1/2', 'w-1/4', 'w-1/6', 'w-1/12']
        const widthClass = widthClasses[i] || 'w-full'
        return <Skeleton key={i} className={`h-4 ${widthClass}`} />
      })}
    </div>
  )
}

function PageSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function FormSkeleton({
  fields = 4,
  headerWidth = 'w-32',
  fieldHeights = ['h-10', 'h-10', 'h-10', 'h-10'],
  fieldWidths = ['w-full', 'w-full', 'w-full', 'w-full'],
  showHeaderButtons = true,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  fields?: number
  headerWidth?: string
  fieldHeights?: string[]
  fieldWidths?: string[]
  showHeaderButtons?: boolean
}) {
  return (
    <div className={cn('w-full space-y-4 p-4', className)} {...props}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" />
        {showHeaderButtons && (
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        )}
      </div>

      <Card className="w-full border border-border/50 shadow-none backdrop-blur-sm">
        <CardHeader>
          <Skeleton className={`h-6 ${headerWidth}`} />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton
                className={`${fieldHeights[i] || 'h-10'} ${fieldWidths[i] || 'w-full'}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function TableSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-8', className)} {...props}>
      <div className="flex items-center justify-between p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-20" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  )
}

function SidebarSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-screen w-64 flex-col border-r bg-sidebar',
        className,
      )}
      {...props}
    >
      {/* Sidebar Content */}
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {/* Main nav items */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1">
              {/* Main item */}
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Sub items (show for some items) */}
              {i === 1 && (
                <div className="ml-6 space-y-1">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 rounded-md px-2 py-1"
                    >
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              )}

              {/* Sub items for other expandable items */}
              {(i === 2 || i === 3 || i === 4) && (
                <div className="ml-6 space-y-1">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 rounded-md px-2 py-1"
                    >
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t p-2">
        <UserSkeleton />
      </div>
    </div>
  )
}

function CardSkeletonQuestion({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      <Card className="border border-border/50 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border dark:border-muted overflow-hidden"
              >
                {/* Parent Item */}
                <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between p-3 md:p-4 gap-3 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      {/* Expand/Collapse Button */}
                      <Skeleton className="h-8 w-8 md:h-9 md:w-9" />

                      {/* Icon */}
                      <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-lg" />

                      {/* Title and Date */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-5 w-48 md:w-64" />
                        <Skeleton className="h-4 w-32 md:w-40" />
                      </div>
                    </div>

                    {/* Action Buttons - Desktop */}
                    <div className="hidden lg:flex items-center gap-2">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>

                    {/* Action Button - Mobile */}
                    <div className="lg:hidden">
                      <Skeleton className="h-8 w-8 md:h-9 md:w-9" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TreeNodeSkeleton({
  count = 2,
  className,
  ...props
}: { count?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('w-full space-y-4 p-4', className)} {...props}>
      {/* Header with buttons */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" /> {/* Title */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" /> {/* Expand All */}
          <Skeleton className="h-9 w-40 rounded-md" /> {/* New Question Type */}
        </div>
      </div>

      {/* Card with tree items */}
      <Card className="border border-border/50 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" /> {/* "Question Tree" */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border dark:border-muted overflow-hidden"
              >
                {/* Parent Item */}
                <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between p-3 md:p-4 gap-3 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      {/* Expand/Collapse Button */}
                      <Skeleton className="h-8 w-8 md:h-9 md:w-9 rounded-md" />

                      {/* Icon */}
                      <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-lg" />

                      {/* Title and Date */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-5 w-48 md:w-64" />
                        <Skeleton className="h-4 w-32 md:w-40" />
                      </div>
                    </div>

                    {/* Action Buttons - Desktop */}
                    <div className="hidden lg:flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-10 w-10 rounded-md" />
                    </div>

                    {/* Action Button - Mobile */}
                    <div className="lg:hidden">
                      <Skeleton className="h-8 w-8 md:h-9 md:w-9 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AvatarSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  )
}

export {
  AvatarSkeleton,
  CardSkeleton,
  CardSkeletonQuestion,
  FormSkeleton,
  PageSkeleton,
  SidebarSkeleton,
  Skeleton,
  TableSkeleton,
  TreeNodeSkeleton,
  UserSkeleton,
}
