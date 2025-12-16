'use client';

import { GenericDataTable } from '@/src/components/generic-data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { ColumnDef } from '@tanstack/react-table';

interface UserItem {
  id: string;
  name: string;
  src: string;
  fallback: string;
  email: string;
  location: string;
  status: string;
  balance: string;
}

const columns: ColumnDef<UserItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.src} alt={item.fallback} />
            <AvatarFallback className="text-xs">{item.fallback}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{item.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => <div className="text-right">{row.original.balance}</div>,
  },
];

const items: UserItem[] = [
  {
    id: '1',
    name: 'Philip George',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    fallback: 'PG',
    email: 'philipgeorge20@gmail.com',
    location: 'Mumbai, India',
    status: 'Active',
    balance: '$10,696.00',
  },
  {
    id: '2',
    name: 'Tiana Curtis',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    fallback: 'TC',
    email: 'tiana12@yahoo.com',
    location: 'New York, US',
    status: 'applied',
    balance: '$0.00',
  },
  {
    id: '3',
    name: 'Jaylon Donin',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'JD',
    email: 'jaylon23d.@outlook.com',
    location: 'Washington, US',
    status: 'Active',
    balance: '$569.00',
  },
  {
    id: '4',
    name: 'Kim Yim',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    fallback: 'KY',
    email: 'kim96@gmail.com',
    location: 'Busan, South Korea',
    status: 'Inactive',
    balance: '-$506.90',
  },
];

const TableUser = () => {
  return (
    <div>
      <GenericDataTable
        columns={columns}
        data={items}
        searchKey="name"
        searchPlaceholder="Search users by name..."
      />
    </div>
  );
};

export default TableUser;
