import { NewPermission } from '../lib/db/schema'
import { permissionModel } from '../models/permissionModel'

export class PermissionController {
  async list(options: { page?: number; limit?: number }) {
    const result = await permissionModel.findAll(options)
    return result
  }

  async create(data: NewPermission) {
    const result = await permissionModel.create(data)
    return result
  }
}

export const permissionController = new PermissionController()
