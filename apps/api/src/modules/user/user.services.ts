import type { CreateUserDTO, UpdateUserDTO } from "./user.dto.js";
import type { UserRepository } from "./user.repo.js";

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async save(data: CreateUserDTO) {
    return this.userRepo.upsertUser(data);
  }

  async update(clerkId: string, data: UpdateUserDTO) {
    return this.userRepo.update(clerkId, data);
  }
}
