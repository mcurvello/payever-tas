import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    this.client.emit('user_created', newUser);

    return await newUser.save();
  }

  async findById(userId: number): Promise<User> {
    this.client.emit('user_fetched', userId);
    return await this.userModel.findById(userId).exec();
  }

  async getAvatarByUserId(userId: number): Promise<string> {
    const user = await this.userModel.findById(userId);

    if (!user || !user.avatar) {
      return '';
    }

    if (user.avatar.startsWith('data:image/')) {
      return user.avatar;
    }

    const avatarUrl = path.join(__dirname, '..', 'avatars', user.avatar);
    const base64Image = await fs.readFile(avatarUrl, 'base64');

    const avatar = `data:image/jpeg;base64,${base64Image}`;

    this.client.emit('avatar_fetched', avatar);
    return avatar;
  }

  async deleteAvatarByUserId(id: number): Promise<void> {
    const user = await this.userModel.findOne({ id });

    if (!user || !user.avatar) {
      return;
    }

    const avatarPath = path.join(__dirname, '..', 'avatars', user.avatar);

    await fs.unlink(avatarPath);

    await this.userModel.updateOne({ userId: id }, { avatar: null });

    this.client.emit('avatar_deleted', id);
    await user.save();
  }
}
