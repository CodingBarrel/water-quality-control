import { Test, TestingModule } from '@nestjs/testing';
import { RuleAssignmentController } from './rule-assignment.controller';
import { RuleAssignmentService } from './rule-assignment.service';
import { CreateRuleAssignmentDto } from './dto/create-rule-assignment.dto';
import { UpdateRuleAssignmentDto } from './dto/update-rule-assignment.dto';

describe('RuleAssignmentController', () => {
  let controller: RuleAssignmentController;
  let service: RuleAssignmentService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAssignment = {
    id: 1,
    controller: { id: 1 },
    template: { id: 2 },
    parameterMap: { ph: 'sensor1' },
    isEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleAssignmentController],
      providers: [{ provide: RuleAssignmentService, useValue: mockService }],
    }).compile();

    controller = module.get<RuleAssignmentController>(RuleAssignmentController);
    service = module.get<RuleAssignmentService>(RuleAssignmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreateRuleAssignmentDto = {
        controllerId: 1,
        templateId: 2,
        parameterMap: { ph: 'sensor1' },
        isEnabled: true,
      };

      mockService.create.mockResolvedValue(mockAssignment);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('findAll', () => {
    it('should return all rule assignments', async () => {
      mockService.findAll.mockResolvedValue([mockAssignment]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockAssignment]);
    });
  });

  describe('findOne', () => {
    it('should return rule assignment by id', async () => {
      mockService.findOne.mockResolvedValue(mockAssignment);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('update', () => {
    it('should call service.update and return updated result', async () => {
      const dto: UpdateRuleAssignmentDto = {
        isEnabled: false,
        parameterMap: { temp: 'sensorX' },
      };

      const updated = { ...mockAssignment, isEnabled: false };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return result', async () => {
      mockService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
