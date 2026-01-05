import { Permission, permissions } from '../lib/db/schema'
import { BaseModel } from './baseModel'

export class PermissionModel extends BaseModel<Permission> {
  constructor() {
    super(permissions)
  }
}

export const permissionModel = new PermissionModel()
