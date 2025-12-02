import { PermissionCheck } from './rbac';

export interface SidebarItem {
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  badge: string | number;
  permission?: PermissionCheck;
  items?: SidebarItem[];
}
