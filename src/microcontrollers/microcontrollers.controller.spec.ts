import { Test, TestingModule } from '@nestjs/testing';
import { MicrocontrollersController } from './microcontrollers.controller';
import { MicrocontrollersService } from './microcontrollers.service';
import { SensorsService } from '../sensors/sensors.service';
import { SensorLogService } from '../logs/sensor-log.service';
import { ControllerStatus } from './entities/microcontrollers.entity';

describe('MicrocontrollersController', () => {
  let controller: MicrocontrollersController;
  let service: MicrocontrollersService;

  const mockMicrocontroller = {
    id: 1,
    serialNumber: 'esp32-ABC123',
    firmwareVersion: '1.0.0',
    status: ControllerStatus.PENDING,
  };

  const mockMicrocontrollersService = {
    findOneBySerialNumberOrFail: jest
      .fn()
      .mockResolvedValue(mockMicrocontroller),
    registerOrUpdate: jest.fn().mockResolvedValue(mockMicrocontroller),
    findAll: jest.fn().mockResolvedValue([mockMicrocontroller]),
    findOneBySerialNumber: jest.fn().mockResolvedValue(mockMicrocontroller),
  };

  const mockSensorsService = {
    register: jest.fn(),
  };

  const mockSensorLogService = {
    insertMany: jest.fn().mockResolvedValue([{ sensorId: 1, value: 6.8 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicrocontrollersController],
      providers: [
        {
          provide: MicrocontrollersService,
          useValue: mockMicrocontrollersService,
        },
        { provide: SensorsService, useValue: mockSensorsService },
        { provide: SensorLogService, useValue: mockSensorLogService },
      ],
    }).compile();

    controller = module.get<MicrocontrollersController>(
      MicrocontrollersController,
    );
    service = module.get<MicrocontrollersService>(MicrocontrollersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStatuses', () => {
    it('should return controller statuses enum', () => {
      const result = controller.getStatuses();
      expect(result).toBe(ControllerStatus);
    });
  });

  describe('register', () => {
    it('should register or update a controller', async () => {
      const dto = { serialNumber: 'esp32-ABC123', firmwareVersion: '1.0.0' };
      const result = await controller.register(dto as any);
      expect(service.registerOrUpdate).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockMicrocontroller);
    });
  });

  describe('findAll', () => {
    it('should return an array of controllers', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockMicrocontroller]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return controller by serial number', async () => {
      const result = await controller.findOne('esp32-ABC123');
      expect(result).toEqual(mockMicrocontroller);
      expect(service.findOneBySerialNumber).toHaveBeenCalledWith(
        'esp32-ABC123',
      );
    });
  });

  describe('addSensorLogs', () => {
    it('should log sensor data and return result', async () => {
      const logs = [{ sensorId: 1, value: 6.8 }];
      const result = await controller.addSensorLogs(
        'esp32-ABC123',
        logs as any,
      );
      expect(service.findOneBySerialNumberOrFail).toHaveBeenCalledWith(
        'esp32-ABC123',
      );
      expect(mockSensorLogService.insertMany).toHaveBeenCalled();
      expect(result).toEqual([{ sensorId: 1, value: 6.8 }]);
    });
  });
});
