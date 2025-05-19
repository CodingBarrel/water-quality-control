import { Test, TestingModule } from '@nestjs/testing';
import { MicrocontrollersService } from './microcontrollers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Microcontroller,
  ControllerStatus,
} from './entities/microcontrollers.entity';
import { Repository } from 'typeorm';
import { SensorsService } from '../sensors/sensors.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { RuleAssignmentService } from '../rule-assignment/rule-assignment.service';
import { NotFoundException } from '@nestjs/common';

describe('MicrocontrollersService', () => {
  let service: MicrocontrollersService;
  let repo: Repository<Microcontroller>;

  const mockRepo = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOneByOrFail: jest.fn(),
  };

  const mockSensorsService = {
    registerForController: jest.fn(),
  };

  const mockConfigService = {
    findOne: jest.fn(),
  };

  const mockRuleAssignmentService = {};

  const controllerEntity: Microcontroller = {
    id: 1,
    serialNumber: 'esp32-ABC123',
    firmwareVersion: '1.0.0',
    ip: '192.168.0.12',
    location: 'Lab 1',
    configuration: null,
    status: ControllerStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSyncedAt: new Date(),
    sensors: [],
    devices: [],
    assignedRules: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicrocontrollersService,
        { provide: getRepositoryToken(Microcontroller), useValue: mockRepo },
        { provide: SensorsService, useValue: mockSensorsService },
        { provide: ConfigurationService, useValue: mockConfigService },
        { provide: RuleAssignmentService, useValue: mockRuleAssignmentService },
      ],
    }).compile();

    service = module.get<MicrocontrollersService>(MicrocontrollersService);
    repo = module.get(getRepositoryToken(Microcontroller));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerOrUpdate', () => {
    it('should update existing controller', async () => {
      mockRepo.findOneBy.mockResolvedValue({ ...controllerEntity });
      mockRepo.save.mockResolvedValue({
        ...controllerEntity,
        firmwareVersion: '1.1.0',
      });

      const dto = {
        serialNumber: 'esp32-ABC123',
        firmwareVersion: '1.1.0',
      };

      const result = await service.registerOrUpdate(dto as any);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        serialNumber: dto.serialNumber,
      });
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.firmwareVersion).toBe('1.1.0');
    });

    it('should create a new controller if not exists', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(controllerEntity);
      mockRepo.save.mockResolvedValue(controllerEntity);

      const dto = { serialNumber: 'esp32-XYZ999', firmwareVersion: '0.1.0' };
      const result = await service.registerOrUpdate(dto as any);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.serialNumber).toBe('esp32-ABC123'); // бо ти в mock повертаєш саме controllerEntity
    });
  });

  describe('findAll', () => {
    it('should return list of microcontrollers', async () => {
      mockRepo.find.mockResolvedValue([controllerEntity]);
      const result = await service.findAll();
      expect(result.length).toBe(1);
      expect(result[0].serialNumber).toBe('esp32-ABC123');
    });
  });

  describe('findOneBySerialNumberOrFail', () => {
    it('should return controller if found', async () => {
      mockRepo.findOneByOrFail.mockResolvedValue(controllerEntity);
      const result = await service.findOneBySerialNumberOrFail('esp32-ABC123');
      expect(result.id).toBe(controllerEntity.id);
    });

    it('should throw if not found', async () => {
      mockRepo.findOneByOrFail.mockRejectedValue(new Error());
      await expect(
        service.findOneBySerialNumberOrFail('not-exist'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeBySerialNumber', () => {
    it('should delete microcontroller', async () => {
      mockRepo.findOneBy.mockResolvedValue(controllerEntity);
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.removeBySerialNumber('esp32-ABC123');
      expect(result).toEqual({ deleted: true });
    });

    it('should throw if not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.removeBySerialNumber('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if delete fails', async () => {
      mockRepo.findOneBy.mockResolvedValue(controllerEntity);
      mockRepo.delete.mockResolvedValue({ affected: 0 });

      await expect(
        service.removeBySerialNumber('esp32-ABC123'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
