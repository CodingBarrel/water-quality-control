import { Test, TestingModule } from '@nestjs/testing';
import { SensorParametersController } from './sensor-parameters.controller';
import { SensorParametersService } from './sensor-parameters.service';
import { CreateSensorParameterDto } from './dto/create-sensor-parameter.dto';

describe('SensorParametersController', () => {
  let controller: SensorParametersController;
  let service: SensorParametersService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockParam = {
    id: 1,
    name: 'pH',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorParametersController],
      providers: [{ provide: SensorParametersService, useValue: mockService }],
    }).compile();

    controller = module.get<SensorParametersController>(
      SensorParametersController,
    );
    service = module.get<SensorParametersService>(SensorParametersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with dto and return result', async () => {
      const dto: CreateSensorParameterDto = { name: 'pH' };
      mockService.create.mockResolvedValue(mockParam);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockParam);
    });
  });

  describe('findAll', () => {
    it('should return all sensor parameters', async () => {
      mockService.findAll.mockResolvedValue([mockParam]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockParam]);
    });
  });

  describe('update', () => {
    it('should convert id to number and call service.update', async () => {
      const dto = { name: 'EC' };
      mockService.update.mockResolvedValue({ ...mockParam, name: 'EC' });

      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.name).toBe('EC');
    });
  });

  describe('remove', () => {
    it('should convert id to number and call service.remove', async () => {
      mockService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
