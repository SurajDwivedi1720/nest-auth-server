import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Customer } from './customers.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<Customer & Document>,
  ) {}

  async findOne(email: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }).exec();
  }

  async create(user: Partial<Customer>): Promise<Customer> {
    const newUser = new this.customerModel(user);
    return newUser.save();
  }

  async updateSessionId(
    email: string,
    sessionId: string | null,
  ): Promise<void> {
    await this.customerModel.updateOne({ email }, { sessionId }).exec();
  }
}
