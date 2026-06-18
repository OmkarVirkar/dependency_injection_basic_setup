import { Test, TestingModule } from '@nestjs/testing';
import { DiskService } from './disk.service';
import { PowerService } from '../power/power.service';

describe('DiskService (with PowerService DI)', () => {
  let diskService: DiskService;
  let powerService: PowerService;
  let mockPowerService: Partial<PowerService>;

  describe('with real PowerService', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [DiskService, PowerService],
      }).compile();

      diskService = module.get<DiskService>(DiskService);
      powerService = module.get<PowerService>(PowerService);
    });

    it('should be defined', () => {
      expect(diskService).toBeDefined();
    });

    it('should have PowerService injected', () => {
      expect(powerService).toBeDefined();
    });

    it('should read data from disk', () => {
      const data = diskService.getData();
      expect(data).toBeDefined();
      expect(typeof data).toBe('string');
      expect(data).toBe('data!');
    });
  });

  describe('with mocked PowerService', () => {
    beforeEach(async () => {
      mockPowerService = {
        supplyPower: jest.fn().mockReturnValue(300),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          DiskService,
          { provide: PowerService, useValue: mockPowerService },
        ],
      }).compile();

      diskService = module.get<DiskService>(DiskService);
    });

    it('should use the mocked PowerService', () => {
      const result = diskService.getData();
      expect(mockPowerService.supplyPower).toHaveBeenCalledWith(20);
      expect(result).toBe('data!');
    });

    it('should verify DI injection works with mock', () => {
      diskService.getData();
      expect(mockPowerService.supplyPower).toHaveBeenCalled();
    });
  });
});
