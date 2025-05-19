import { Test, TestingModule } from '@nestjs/testing';
import { SensorParametersService } from './sensor-parameters.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SensorParameter } from './entities/sensor-parameter.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SensorParametersService', () => {
  let service: SensorParametersService;
  let repo: Repository<SensorParameter>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockParameter: SensorParameter = {
    id: 1,
    name: 'pH',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorParametersService,
        {
          provide: getRepositoryToken(SensorParameter),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<SensorParametersService>(SensorParametersService);
    repo = module.get(getRepositoryToken(SensorParameter));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new sensor parameter', async () => {
      mockRepo.create.mockReturnValue(mockParameter);
      mockRepo.save.mockResolvedValue(mockParameter);

      const result = await service.create({ name: 'pH' });
      expect(repo.create).toHaveBeenCalledWith({ name: 'pH' });
      expect(repo.save).toHaveBeenCalledWith(mockParameter);
      expect(result).toEqual(mockParameter);
    });
  });

  describe('findAll', () => {
    it('should return all sensor parameters', async () => {
      mockRepo.find.mockResolvedValue([mockParameter]);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockParameter]);
    });
  });

  describe('update', () => {
    it('should update and save a sensor parameter', async () => {
      const updated = { ...mockParameter, name: 'EC' };
      mockRepo.findOneBy.mockResolvedValue(mockParameter);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'EC' });
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.save).toHaveBeenCalledWith(updated);
      expect(result.name).toBe('EC');
    });

    it('should throw NotFoundException if parameter not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, { name: 'Temp' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete sensor parameter and return confirmation', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockParameter);
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if parameter not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1234)).rejects.toThrow(NotFoundException);
    });
  });
});
