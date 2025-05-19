import { Test, TestingModule } from '@nestjs/testing';
import { RuleTemplateController } from './rule-template.controller';
import { RuleTemplateService } from './rule-template.service';
import { CreateRuleTemplateDto } from './dto/create-rule-template.dto';
import { UpdateRuleTemplateDto } from './dto/update-rule-template.dto';

describe('RuleTemplateController', () => {
  let controller: RuleTemplateController;
  let service: RuleTemplateService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTemplate = {
    id: 1,
    name: 'Overheat Rule',
    logic: { if: { all: [{ sensor: 'temp', op: '>', value: 30 }] }, then: [] },
    description: 'Triggers when temperature exceeds 30',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleTemplateController],
      providers: [{ provide: RuleTemplateService, useValue: mockService }],
    }).compile();

    controller = module.get<RuleTemplateController>(RuleTemplateController);
    service = module.get<RuleTemplateService>(RuleTemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a rule template', async () => {
      const dto: CreateRuleTemplateDto = {
        name: 'Overheat Rule',
        logic: mockTemplate.logic,
        description: mockTemplate.description,
      };
      mockService.create.mockResolvedValue(mockTemplate);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTemplate);
    });
  });

  describe('findAll', () => {
    it('should return all rule templates', async () => {
      mockService.findAll.mockResolvedValue([mockTemplate]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockTemplate]);
    });
  });

  describe('findOne', () => {
    it('should return rule template by id', async () => {
      mockService.findOne.mockResolvedValue(mockTemplate);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTemplate);
    });
  });

  describe('update', () => {
    it('should update rule template', async () => {
      const dto: UpdateRuleTemplateDto = { name: 'New Name' };
      const updated = { ...mockTemplate, name: 'New Name' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('should remove rule template', async () => {
      mockService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
