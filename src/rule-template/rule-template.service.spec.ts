import { Test, TestingModule } from '@nestjs/testing';
import { RuleTemplateService } from './rule-template.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RuleTemplate } from './entities/rule-template.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('RuleTemplateService', () => {
  let service: RuleTemplateService;
  let repo: Repository<RuleTemplate>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockTemplate: RuleTemplate = {
    id: 1,
    name: 'Overheat Rule',
    logic: { if: { all: [{ sensor: 'temp', op: '>', value: 30 }] }, then: [] },
    description: 'Triggers when temperature exceeds 30',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RuleTemplateService,
        {
          provide: getRepositoryToken(RuleTemplate),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<RuleTemplateService>(RuleTemplateService);
    repo = module.get(getRepositoryToken(RuleTemplate));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a rule template', async () => {
      mockRepo.create.mockReturnValue(mockTemplate);
      mockRepo.save.mockResolvedValue(mockTemplate);

      const dto = {
        name: 'Overheat Rule',
        logic: mockTemplate.logic,
        description: mockTemplate.description,
      };

      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockTemplate);
      expect(result).toEqual(mockTemplate);
    });
  });

  describe('findAll', () => {
    it('should return all rule templates', async () => {
      mockRepo.find.mockResolvedValue([mockTemplate]);

      const result = await service.findAll();
      expect(result).toEqual([mockTemplate]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a rule template by id', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTemplate);

      const result = await service.findOne(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockTemplate);
    });

    it('should throw if template not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIds', () => {
    it('should return matching rule templates by ids', async () => {
      mockRepo.findBy.mockResolvedValue([mockTemplate]);
      const result = await service.findByIds([1]);
      expect(result).toEqual([mockTemplate]);
    });
  });

  describe('update', () => {
    it('should update and save a rule template', async () => {
      const updated = { ...mockTemplate, name: 'New name' };
      mockRepo.findOneBy.mockResolvedValue(mockTemplate);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'New name' });
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.save).toHaveBeenCalledWith(updated);
      expect(result.name).toBe('New name');
    });

    it('should throw if template not found for update', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.update(2, { name: 'fail' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete rule template and return confirmation', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockTemplate);
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw if rule template not found for deletion', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
