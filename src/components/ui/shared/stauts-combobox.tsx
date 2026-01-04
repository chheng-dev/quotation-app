'use client'

import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'

export const title = 'Small Size Variant'

const statuses = [
  { value: 'inactive', label: 'Inactive' },
  { value: 'active', label: 'Active' },
]

const StatusCombobox = ({
  defaultValue,
  value,
  onValueChange,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue)

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  const currentValue = value !== undefined ? value : internalValue

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="active">Active</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default StatusCombobox
