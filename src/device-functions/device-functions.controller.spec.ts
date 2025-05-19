import { Test, TestingModule } from '@nestjs/testing';
import { DeviceFunctionsController } from './device-functions.controller';
import { DeviceFunctionsService } from './device-functions.service';

describe('DeviceFunctionsController', () => {
  let controller: DeviceFunctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceFunctionsController],
      providers: [DeviceFunctionsService],
    }).compile();

    controller = module.get<DeviceFunctionsController>(DeviceFunctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
