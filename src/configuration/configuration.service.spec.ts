import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Configuration } from './entities/configuration.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let repo: Repository<Configuration>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockConfig: Configuration = {
    id: 1,
    name: 'Basic Config',
    checkForConfigurationUpdateDelay: 30,
    sendLogsDelay: 30,
    isDefault: false,
    microcontrollers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    repo = module.get(getRepositoryToken(Configuration));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save configuration', async () => {
      mockRepo.create.mockReturnValue(mockConfig);
      mockRepo.save.mockResolvedValue(mockConfig);

      const dto = {
        name: 'Basic Config',
        checkForConfigurationUpdateDelay: 30,
        sendLogsDelay: 30,
        isDefault: false,
      };

      const result = await service.create(dto as any);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockConfig);
      expect(result).toEqual(mockConfig);
    });
  });

  describe('findAll', () => {
    it('should return all configurations', async () => {
      mockRepo.find.mockResolvedValue([mockConfig]);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockConfig]);
    });
  });

  describe('findOne', () => {
    it('should return configuration by id', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockConfig);
      const result = await service.findOne(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockConfig);
    });

    it('should throw if configuration not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update configuration and return it', async () => {
      const updated = { ...mockConfig, name: 'Updated' };
      mockRepo.findOneBy.mockResolvedValue(mockConfig);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Updated' } as any);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.save).toHaveBeenCalledWith(updated);
      expect(result.name).toBe('Updated');
    });

    it('should throw if configuration not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.update(99, { name: 'X' } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete configuration and return result', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockConfig);
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw if configuration not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(404)).rejects.toThrow(NotFoundException);
    });
  });
});
