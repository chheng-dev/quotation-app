'use client'

import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  RoleFormSchema,
  RoleUpdateFormSchema,
  roleCreateSchema,
  roleUpdateSchema,
} from '@/src/components/form-schema/role-schema'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/ui/collapsible'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import PermissionCard from '@/src/components/ui/shared/permission-card'
import { Switch } from '@/src/components/ui/switch'
import { Textarea } from '@/src/components/ui/textarea'
import { FormRef, useFormRef } from '@/src/hooks/use-form-ref'
import { getPermissions, listPermissions } from '@/src/hooks/use-permission'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDownIcon,
  Contact as ContactIcon,
  FileIcon,
  ShieldCheckIcon,
  UserIcon,
  Users as UsersIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  onSubmit: (
    values: RoleFormSchema | RoleUpdateFormSchema,
    reset: () => void,
  ) => Promise<void>
  defaultValue?: Partial<RoleUpdateFormSchema>
  mode?: 'create' | 'update'
}

export type RoleFormRef = FormRef<RoleFormSchema | RoleUpdateFormSchema>

const RoleForm = forwardRef<RoleFormRef, Props>(
  ({ onSubmit, defaultValue, mode }, ref) => {
    const formMode = mode || (defaultValue?.id ? 'update' : 'create')
    const schema = formMode === 'create' ? roleCreateSchema : roleUpdateSchema

    // Get raw permissions data with IDs for mapping
    const { data: permissionsData } = getPermissions()
    const rawPermissions = permissionsData?.items || []

    // Transform API permissions format to form format
    const transformPermissionsForForm = (apiPermissions: any[]) => {
      if (!apiPermissions || !Array.isArray(apiPermissions)) return []
      return apiPermissions.map((p: any) => ({
        resource: p.resource,
        action: p.action,
      }))
    }

    const form = useForm<RoleFormSchema | RoleUpdateFormSchema>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(schema) as any,
      defaultValues: {
        ...(formMode === 'update' &&
          defaultValue?.id && { id: defaultValue.id }),
        name: defaultValue?.name || '',
        description: defaultValue?.description || '',
        permissions: transformPermissionsForForm(
          defaultValue?.permissions || [],
        ),
      },
    })

    const transformPermissionsToIds = (
      formPermissions: { resource: string; action: string }[],
    ) => {
      if (!formPermissions || !Array.isArray(formPermissions)) return []
      if (!rawPermissions || rawPermissions.length === 0) return []

      return formPermissions
        .map((fp) => {
          const permission = rawPermissions.find(
            (p: any) => p.resource === fp.resource && p.action === fp.action,
          )
          return permission?.id
        })
        .filter((id): id is number => id !== undefined && id !== null)
    }

    useFormRef(ref, {
      form,
      onSubmit: async (values, reset) => {
        // Transform permissions to IDs before submitting
        const transformedValues = {
          ...values,
          permissions: transformPermissionsToIds(values.permissions),
        }
        await onSubmit(
          transformedValues as RoleFormSchema | RoleUpdateFormSchema | any,
          reset,
        )
      },
    })

    const { permissions } = listPermissions()

    const [expandedResources, setExpandedResources] = useState<string[]>(
      permissions.map((p) => p.resource),
    )

    const toggleResource = (resource: string) => {
      setExpandedResources((prev) =>
        prev.includes(resource)
          ? prev.filter((r) => r !== resource)
          : [...prev, resource],
      )
    }

    const toggleAll = () => {
      if (expandedResources.length === permissions.length) {
        setExpandedResources([])
      } else {
        setExpandedResources(permissions.map((p: any) => p.resource))
      }
    }

    const handleToggleGroup = (resource: string, checked: boolean) => {
      const group = permissions.find((g) => g.resource === resource)
      if (!group) return

      const current = form.getValues('permissions') || []
      const otherPermissions = current.filter((p) => p.resource !== resource)

      if (checked) {
        const groupPermissions = group.actions.map((a) => ({
          resource,
          action: a.action as any,
        }))
        form.setValue(
          'permissions',
          [...otherPermissions, ...groupPermissions],
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        )
      } else {
        form.setValue('permissions', otherPermissions, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    }

    const handleToggleAllPermissions = (checked: boolean) => {
      if (checked) {
        const allPermissions = permissions.flatMap((group) =>
          group.actions.map((a) => ({
            resource: group.resource,
            action: a.action as any,
          })),
        )
        form.setValue('permissions', allPermissions, {
          shouldValidate: true,
          shouldDirty: true,
        })
      } else {
        form.setValue('permissions', [], {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    }

    const handlePermissionChange = (
      resource: string,
      action: string,
      checked: boolean,
    ) => {
      const current = form.getValues('permissions') || []
      if (checked) {
        form.setValue(
          'permissions',
          [...current, { resource, action: action as any }],
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        )
      } else {
        form.setValue(
          'permissions',
          current.filter(
            (p) => !(p.resource === resource && p.action === action),
          ),
          { shouldValidate: true, shouldDirty: true },
        )
      }
    }

    return (
      <Form {...form}>
        <form className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Role Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Administrator" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What can users with this role do?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-base font-medium">
                    Access Permissions
                  </CardTitle>
                  <div className="flex items-center gap-2 border-l pl-4 py-1">
                    <Switch
                      id="global-select-all"
                      checked={
                        form.watch('permissions')?.length ===
                        permissions.flatMap((g) => g.actions).length
                      }
                      onCheckedChange={handleToggleAllPermissions}
                    />
                    <Label
                      htmlFor="global-select-all"
                      className="text-xs font-medium cursor-pointer"
                    >
                      Select All
                    </Label>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="text-primary hover:text-primary/80 flex gap-x-1 items-center cursor-pointer"
                  onClick={toggleAll}
                >
                  <ChevronsUpDownIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">
                    {expandedResources.length === permissions.length
                      ? 'Collapse All'
                      : 'Expand All'}
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((group) => {
                  // Map resource to icon
                  const iconMap: Record<string, any> = {
                    users: UserIcon,
                    roles: ShieldCheckIcon,
                    customers: UsersIcon,
                    contacts: ContactIcon,
                  }
                  const ResourceIcon = iconMap[group.resource] || FileIcon
                  const selectedCount =
                    form
                      .watch('permissions')
                      ?.filter((p) => p.resource === group.resource).length || 0
                  const isExpanded = expandedResources.includes(group.resource)

                  return (
                    <Collapsible
                      key={group.resource}
                      open={isExpanded}
                      onOpenChange={() => toggleResource(group.resource)}
                      className="border rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <CollapsibleTrigger asChild>
                        <div
                          className={cn(
                            'flex items-center justify-between p-4 cursor-pointer transition-colors',
                            isExpanded
                              ? 'bg-primary/5'
                              : 'bg-card hover:bg-accent/50',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'p-2 rounded-lg',
                                isExpanded
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground',
                              )}
                            >
                              <ResourceIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold capitalize">
                                {group.resource} Management
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Configure access levels for {group.resource}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {selectedCount > 0 && (
                              <Badge
                                variant="secondary"
                                className="px-2 py-0.5 text-[10px] font-bold"
                              >
                                {selectedCount} active
                              </Badge>
                            )}
                            <div
                              className="flex items-center gap-2 border-l pl-3 ml-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Switch
                                checked={selectedCount === group.actions.length}
                                onCheckedChange={(checked) =>
                                  handleToggleGroup(group.resource, checked)
                                }
                              />
                            </div>
                            <div className="border-l pl-3">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 bg-background border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {group.actions.map((item: any) => {
                            const isChecked = form
                              .watch('permissions')
                              ?.some(
                                (p) =>
                                  p.resource === group.resource &&
                                  p.action === item.action,
                              )
                            return (
                              <PermissionCard
                                key={`${group.resource}-${item.action}`}
                                label={item.label}
                                description={item.description}
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    group.resource,
                                    item.action,
                                    checked,
                                  )
                                }
                              />
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    )
  },
)

RoleForm.displayName = 'RoleForm'

export default RoleForm
