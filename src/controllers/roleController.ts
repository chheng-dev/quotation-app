import { RoleWithPermissions, roleModel } from '../models/roleModel'

export class RoleController {
  async findAllWithPermissions() {
    return await roleModel.getRolesWithPermissions()
  }

  async createRoleWithPermissions(data: RoleWithPermissions) {
    const result = await roleModel.createRoleWithPermissions(data)
    return result
  }
}

export const roleController = new RoleController()
