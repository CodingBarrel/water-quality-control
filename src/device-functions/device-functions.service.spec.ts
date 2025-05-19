import { Test, TestingModule } from '@nestjs/testing';
import { DeviceFunctionsService } from './device-functions.service';

describe('DeviceFunctionsService', () => {
  let service: DeviceFunctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceFunctionsService],
    }).compile();

    service = module.get<DeviceFunctionsService>(DeviceFunctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
