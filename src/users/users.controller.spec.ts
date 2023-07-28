import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            getAvatarByUserId: jest.fn(),
            deleteAvatarByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const mockUser: User = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@email.com',
        avatar: 'https://www.image.com/image42',
      };
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockUser);

      const result = await controller.create(mockUser);
      expect(result).toBe(mockUser);
      expect(usersService.create).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUserId = '1';
      const mockUser: User = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@email.com',
        avatar: 'https://www.image.com/image42',
      };
      jest.spyOn(usersService, 'findById').mockResolvedValueOnce(mockUser);

      const result = await controller.findById(mockUserId);
      expect(result).toBe(mockUser);
      expect(usersService.findById).toHaveBeenCalledWith(+mockUserId);
    });
  });

  describe('getAvatar', () => {
    it('should get the avatar for a user', async () => {
      const mockUserId = '1';
      const mockAvatar = 'data:image/jpeg;base64,base64string';
      jest
        .spyOn(usersService, 'getAvatarByUserId')
        .mockResolvedValueOnce(mockAvatar);

      const result = await controller.getAvatar(mockUserId);
      expect(result).toBe(mockAvatar);
      expect(usersService.getAvatarByUserId).toHaveBeenCalledWith(+mockUserId);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar for a user', async () => {
      const mockUserId = '1';
      const mockMessage = { message: 'Avatar deleted successfully.' };
      jest.spyOn(usersService, 'deleteAvatarByUserId').mockResolvedValueOnce();

      const result = await controller.deleteAvatar(mockUserId);
      expect(result).toEqual(mockMessage);
      expect(usersService.deleteAvatarByUserId).toHaveBeenCalledWith(
        +mockUserId,
      );
    });
  });
});
