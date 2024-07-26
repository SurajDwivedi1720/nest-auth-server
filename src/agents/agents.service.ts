import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Agent } from './agents.schema';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<Agent & Document>,
  ) {}

  async findOne(email: string): Promise<Agent | null> {
    return this.agentModel.findOne({ email }).exec();
  }

  async create(agent: Partial<Agent>): Promise<Agent> {
    const newAgent = new this.agentModel(agent);
    return newAgent.save();
  }

  async updateSessionId(
    email: string,
    sessionId: string | null,
  ): Promise<void> {
    await this.agentModel.updateOne({ email }, { sessionId }).exec();
  }
}
