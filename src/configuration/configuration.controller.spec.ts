import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

describe('ConfigurationController', () => {
  let controller: ConfigurationController;
  let service: ConfigurationService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockConfig = {
    id: 1,
    name: 'Basic Config',
    checkForConfigurationUpdateDelay: 30,
    sendLogsDelay: 30,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigurationController],
      providers: [{ provide: ConfigurationService, useValue: mockService }],
    }).compile();

    controller = module.get<ConfigurationController>(ConfigurationController);
    service = module.get<ConfigurationService>(ConfigurationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return configuration', async () => {
      const dto: CreateConfigurationDto = {
        name: 'Test Config',
        checkForConfigurationUpdateDelay: 30,
        sendLogsDelay: 30,
        isDefault: false,
      };

      mockService.create.mockResolvedValue(mockConfig);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockConfig);
    });
  });

  describe('findAll', () => {
    it('should return all configurations', async () => {
      mockService.findAll.mockResolvedValue([mockConfig]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockConfig]);
    });
  });

  describe('findOne', () => {
    it('should return one configuration by id', async () => {
      mockService.findOne.mockResolvedValue(mockConfig);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockConfig);
    });
  });

  describe('update', () => {
    it('should update and return configuration', async () => {
      const dto: UpdateConfigurationDto = { name: 'Updated Config' };
      const updated = { ...mockConfig, name: 'Updated Config' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove configuration and return result', async () => {
      mockService.remove.mockResolvedValue({ deleted: true });
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
