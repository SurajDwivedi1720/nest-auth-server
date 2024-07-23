import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User & Document>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateSessionId(
    email: string,
    sessionId: string | null,
  ): Promise<void> {
    await this.userModel.updateOne({ email }, { sessionId }).exec();
  }
}
