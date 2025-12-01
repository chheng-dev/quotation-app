import { userModel } from "../models/userModel";

class UserController {
  async list() {
    const result = await userModel.findAll();
    return result;
  }

  async getUser() {
    const result = await userModel.findActiveUsers();
    return result;
  }

  async deactivateUser(userId: number) {
    const result = await userModel.deactivateUser(userId);
    return result;
  }

  async activateUser(userId: number) {
    const result = await userModel.activateUser(userId);
    return result;
  }
}

export const userController = new UserController();