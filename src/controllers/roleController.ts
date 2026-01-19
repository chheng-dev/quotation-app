import { RoleWithPermissions, roleModel } from '../models/roleModel'

export class RoleController {
  async findAllWithPermissions() {
    return await roleModel.getRolesWithPermissions()
  }

  async findRoleWithPermissions(name: string) {
    return await roleModel.findRoleWithPermissions(name)
  }

  async createRoleWithPermissions(data: RoleWithPermissions) {
    const result = await roleModel.createRoleWithPermissions(data)
    return result
  }

  async updateRoleWithPermissions(name: string, data: RoleWithPermissions) {
    const result = await roleModel.updateRoleWithPermissions(name, data)
    return result
  }
}

export const roleController = new RoleController()
