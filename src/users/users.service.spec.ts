import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { promises as fs } from 'fs';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue({}),
            findOne: jest.fn().mockResolvedValue({}),
            updateOne: jest.fn().mockResolvedValue({}),
            save: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    client = module.get<ClientProxy>('RABBITMQ_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUserId = 1;
      const mockUser: User = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@email.com',
        avatar: 'https://www.image.com/image42',
      };

      jest.spyOn(userModel, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.findById(mockUserId);

      expect(result).toBe(mockUser);
      expect(client.emit).toHaveBeenCalledWith('user_fetched', mockUserId);
      expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('getAvatarByUserId', () => {
    it('should get the avatar for a user', async () => {
      const mockUserId = 1;
      const mockUser: User = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@email.com',
        avatar: 'https://www.image.com/image42',
      };

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(mockUser);
      jest.spyOn(fs, 'readFile').mockResolvedValueOnce('base64string');

      const result = await service.getAvatarByUserId(mockUserId);
      const expectedAvatar = `data:image/jpeg;base64,base64string`;

      expect(result).toBe(expectedAvatar);
      expect(client.emit).toHaveBeenCalledWith(
        'avatar_fetched',
        expectedAvatar,
      );
      expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
      expect(fs.readFile).toHaveBeenCalled();
    });

    it('should return an empty string if user or avatar is not found', async () => {
      const mockUserId = 1;

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      const result = await service.getAvatarByUserId(mockUserId);

      expect(result).toBe('');
      expect(client.emit).not.toHaveBeenCalled();
      expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
    });
  });
});
