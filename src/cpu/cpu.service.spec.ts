import { Test, TestingModule } from '@nestjs/testing';
import { CpuService } from './cpu.service';
import { PowerService } from '../power/power.service';

describe('CpuService (with PowerService DI)', () => {
  let cpuService: CpuService;
  let powerService: PowerService;
  let mockPowerService: Partial<PowerService>;

  describe('with real PowerService', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [CpuService, PowerService],
      }).compile();

      cpuService = module.get<CpuService>(CpuService);
      powerService = module.get<PowerService>(PowerService);
    });

    it('should be defined', () => {
      expect(cpuService).toBeDefined();
    });

    it('should have PowerService injected', () => {
      expect(powerService).toBeDefined();
    });

    it('should process data with power from PowerService', () => {
      const result = cpuService.computer(2, 6);
      expect(result).toBeDefined();
      expect(typeof result).toBe('number');
      expect(result).toBe(8);
    });
  });

  describe('with mocked PowerService', () => {
    beforeEach(async () => {
      mockPowerService = {
        supplyPower: jest.fn().mockReturnValue(500),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CpuService,
          { provide: PowerService, useValue: mockPowerService },
        ],
      }).compile();

      cpuService = module.get<CpuService>(CpuService);
    });

    it('should use the mocked PowerService', () => {
      cpuService.computer(2, 5);
      expect(mockPowerService.supplyPower).toHaveBeenCalledWith(10);
    });

    it('should call supplyPower with correct wattage', () => {
      cpuService.computer(3, 4);
      expect(mockPowerService.supplyPower).toHaveBeenCalledWith(10);
    });
  });
});
