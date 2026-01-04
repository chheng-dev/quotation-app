/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewUser, User, userModel } from '../models/userModel'

class UserController {
  async findByCode(code: string) {
    const result = await userModel.findByCode(code)
    return result
  }

  async list(query?: any, limit?: number, page?: number) {
    const result = await userModel.findAll(query, limit, page)
    return result
  }

  async getUser() {
    const result = await userModel.findActiveUsers()
    return result
  }

  async createUser(data: NewUser) {
    const result = await userModel.createUser(data as any)
    return result
  }

  async deactivateUser(userId: number) {
    const result = await userModel.deactivateUser(userId)
    return result
  }

  async activateUser(userId: number) {
    const result = await userModel.activateUser(userId)
    return result
  }

  async getCurrentUser(userId: number) {
    const me = await userModel.getCurrentUser(userId)
    return me
  }

  async updateUser(code: string, data: Partial<User>) {
    const result = await userModel.updateMany({ code }, data as any)
    return result
  }

  async deleteUser(code: string) {
    const user = await userModel.findByCode(code)
    if (!user) {
      throw new Error('User not found')
    }
    const result = await userModel.softDelete({ code } as Partial<User>)
    return result
  }
}

export const userController = new UserController()
