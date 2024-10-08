import User from '../database/models/User'
import CryptoService from '../services/CryptoService'
import type { ICryptoService } from '../services/interfaces/ICryptoService'
import type { UserDTO } from './dtos/UserDTO'
import type { IUserRepository } from './interfaces/IUserRepository'

class UserRepository implements IUserRepository {
  private readonly cryptoService: ICryptoService

  constructor() {
    this.cryptoService = new CryptoService()
  }

  async get(): Promise<User[]> {
    const users = await User.findAll()
    return users
  }

  async getById(id: number): Promise<User | null> {
    const user = await User.findOne({
      where: { id },
    })

    return user
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      where: { email },
    })

    return user
  }

  async create(user: UserDTO): Promise<User> {
    const hashedPassword = await this.cryptoService.hashPassword(user.password)

    const createdUser = await User.create({
      ...user,
      password: hashedPassword,
    })
    return createdUser
  }

  async update(user: UserDTO, id: number): Promise<User | null> {
    const foundUser = await this.getById(id)

    if (foundUser != null) {
      await User.update(
        { ...user },
        {
          where: { id },
        }
      )
    }

    return foundUser
  }

  async delete(id: number): Promise<User | null> {
    const foundUser = await this.getById(id)

    if (foundUser != null) {
      await User.destroy({
        where: {
          id,
        },
      })
    }

    return foundUser
  }
}

export default UserRepository
