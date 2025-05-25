import { Test, TestingModule } from '@nestjs/testing';
import { RuleAssignmentService } from './rule-assignment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RuleAssignment } from './entities/rule-assignment.entity';
import { Repository } from 'typeorm';
import { MicrocontrollersService } from '../microcontrollers/microcontrollers.service';
import { RuleTemplateService } from '../rule-template/rule-template.service';
import { NotFoundException } from '@nestjs/common';

describe('RuleAssignmentService', () => {
  let service: RuleAssignmentService;
  let repo: Repository<RuleAssignment>;

  const mockAssignment: RuleAssignment = {
    id: 1,
    parameterMap: { temp: 'sensor1' },
    isEnabled: true,
    controller: { id: 1 } as any,
    template: { id: 2 } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockMcService = {
    findOne: jest.fn(),
  };

  const mockRtService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RuleAssignmentService,
        { provide: getRepositoryToken(RuleAssignment), useValue: mockRepo },
        { provide: MicrocontrollersService, useValue: mockMcService },
        { provide: RuleTemplateService, useValue: mockRtService },
      ],
    }).compile();

    service = module.get<RuleAssignmentService>(RuleAssignmentService);
    repo = module.get(getRepositoryToken(RuleAssignment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new rule assignment', async () => {
      mockMcService.findOne.mockResolvedValue({ id: 1 });
      mockRtService.findOne.mockResolvedValue({ id: 2 });
      mockRepo.create.mockReturnValue(mockAssignment);
      mockRepo.save.mockResolvedValue(mockAssignment);

      const dto = {
        controllerId: 1,
        templateId: 2,
        parameterMap: { temp: 'sensor1' },
        isEnabled: true,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockAssignment);
    });

    it('should throw if controller not found', async () => {
      mockMcService.findOne.mockResolvedValue(null);
      const dto = { controllerId: 1, templateId: 2, parameterMap: {} };
      await expect(service.create(dto as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if template not found', async () => {
      mockMcService.findOne.mockResolvedValue({ id: 1 });
      mockRtService.findOne.mockResolvedValue(null);
      const dto = { controllerId: 1, templateId: 2, parameterMap: {} };
      await expect(service.create(dto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all rule assignments', async () => {
      mockRepo.find.mockResolvedValue([mockAssignment]);
      const result = await service.findAll();
      expect(result).toEqual([mockAssignment]);
    });
  });

  describe('findOne', () => {
    it('should return a rule assignment by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockAssignment);
      const result = await service.findOne(1);
      expect(result).toEqual(mockAssignment);
    });

    it('should throw if assignment not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIds', () => {
    it('should return rule assignments by ids', async () => {
      mockRepo.findBy.mockResolvedValue([mockAssignment]);
      const result = await service.findByIds([1]);
      expect(result).toEqual([mockAssignment]);
    });
  });

  describe('update', () => {
    it('should update rule assignment properties and relations', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockAssignment });
      mockMcService.findOne.mockResolvedValue({ id: 3 });
      mockRtService.findOne.mockResolvedValue({ id: 4 });
      mockRepo.save.mockResolvedValue({
        ...mockAssignment,
        controller: { id: 3 },
        template: { id: 4 },
        isEnabled: false,
      });

      const dto = {
        controllerId: 3,
        templateId: 4,
        isEnabled: false,
        parameterMap: { ph: 'phSensor' },
      };

      const result = await service.update(1, dto);
      expect(result.controller.id).toBe(3);
      expect(result.template.id).toBe(4);
      expect(result.isEnabled).toBe(false);
    });

    it('should throw if assignment not found for update', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a rule assignment', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockAssignment);
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw if rule assignment not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(404)).rejects.toThrow(NotFoundException);
    });
  });
});
