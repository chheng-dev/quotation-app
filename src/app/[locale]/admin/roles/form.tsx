/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
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
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDownIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  onSubmit: (values: any, reset: () => void) => Promise<void>
  defaultValue?: Partial<RoleUpdateFormSchema>
  mode?: 'create' | 'update'
}

export type RoleFormRef = FormRef<RoleUpdateFormSchema>

const AVAILABLE_PERMISSIONS = [
  {
    resource: 'users',
    icon: UserIcon,
    actions: [
      {
        action: 'read',
        label: 'View Users',
        description: 'Access the user listing and basic profiles',
        icon: SearchIcon,
      },
      {
        action: 'create',
        label: 'Create Users',
        description: 'Provision new user accounts',
        icon: PlusIcon,
      },
      {
        action: 'update',
        label: 'Edit Users',
        description: 'Modify existing user details and settings',
        icon: PencilIcon,
      },
      {
        action: 'delete',
        label: 'Delete Users',
        description: 'Optionally disable or remove user accounts',
        icon: Trash2Icon,
      },
    ],
  },
  {
    resource: 'roles',
    icon: ShieldCheckIcon,
    actions: [
      {
        action: 'read',
        label: 'View Roles',
        description: 'See all available roles and their permissions',
        icon: SearchIcon,
      },
      {
        action: 'create',
        label: 'Create Roles',
        description: 'Design new roles with custom permissions',
        icon: PlusIcon,
      },
      {
        action: 'update',
        label: 'Edit Roles',
        description: 'Update permissions for existing roles',
        icon: PencilIcon,
      },
      {
        action: 'delete',
        label: 'Delete Roles',
        description: 'Clean up unused or obsolete roles',
        icon: Trash2Icon,
      },
    ],
  },
]

const RoleForm = forwardRef<RoleFormRef, Props>(
  ({ onSubmit, defaultValue, mode }, ref) => {
    const formMode = mode || (defaultValue?.id ? 'update' : 'create')
    const schema = formMode === 'create' ? roleCreateSchema : roleUpdateSchema

    const form = useForm<RoleUpdateFormSchema>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
        id: defaultValue?.id,
        name: defaultValue?.name || '',
        description: defaultValue?.description || '',
        permissions: defaultValue?.permissions || [],
      },
    })

    useFormRef(ref, {
      form,
      onSubmit: async (values, reset) => {
        await onSubmit(values, reset)
      },
    })

    const [expandedResources, setExpandedResources] = useState<string[]>(
      AVAILABLE_PERMISSIONS.map((p) => p.resource),
    )

    const toggleResource = (resource: string) => {
      setExpandedResources((prev) =>
        prev.includes(resource)
          ? prev.filter((r) => r !== resource)
          : [...prev, resource],
      )
    }

    const toggleAll = () => {
      if (expandedResources.length === AVAILABLE_PERMISSIONS.length) {
        setExpandedResources([])
      } else {
        setExpandedResources(AVAILABLE_PERMISSIONS.map((p) => p.resource))
      }
    }

    const handleToggleGroup = (resource: string, checked: boolean) => {
      const group = AVAILABLE_PERMISSIONS.find((g) => g.resource === resource)
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
        const allPermissions = AVAILABLE_PERMISSIONS.flatMap((group) =>
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
                        AVAILABLE_PERMISSIONS.flatMap((g) => g.actions).length
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
                    {expandedResources.length === AVAILABLE_PERMISSIONS.length
                      ? 'Collapse All'
                      : 'Expand All'}
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AVAILABLE_PERMISSIONS.map((group) => {
                  const ResourceIcon = group.icon
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
                          {group.actions.map((item) => {
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
