import { Test, TestingModule } from '@nestjs/testing';
import { ComputerController } from './computer.controller';
import { CpuService } from '../cpu/cpu.service';
import { DiskService } from '../disk/disk.service';
import { PowerService } from '../power/power.service';

describe('ComputerController (with DI)', () => {
  let controller: ComputerController;
  let cpuService: CpuService;
  let diskService: DiskService;
  let mockCpuService: Partial<CpuService>;
  let mockDiskService: Partial<DiskService>;

  describe('with real services', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ComputerController],
        providers: [CpuService, DiskService, PowerService],
      }).compile();

      controller = module.get<ComputerController>(ComputerController);
      cpuService = module.get<CpuService>(CpuService);
      diskService = module.get<DiskService>(DiskService);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have all dependencies injected', () => {
      expect(cpuService).toBeDefined();
      expect(diskService).toBeDefined();
    });

    it('should return computer status as array', () => {
      const status = controller.run();
      expect(status).toBeDefined();
      expect(Array.isArray(status)).toBe(true);
      expect(status.length).toBe(2);
      expect(status[0]).toBe(10); // CPU result
      expect(status[1]).toBe('data!'); // Disk result
    });
  });

  describe('with mocked services', () => {
    beforeEach(async () => {
      mockCpuService = {
        computer: jest.fn().mockReturnValue(10),
      };

      mockDiskService = {
        getData: jest.fn().mockReturnValue('mock-data'),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [ComputerController],
        providers: [
          { provide: CpuService, useValue: mockCpuService },
          { provide: DiskService, useValue: mockDiskService },
        ],
      }).compile();

      controller = module.get<ComputerController>(ComputerController);
    });

    it('should use injected mocked services', () => {
      const status = controller.run();
      expect(status).toBeDefined();
      expect(Array.isArray(status)).toBe(true);
    });

    it('should call CpuService when processing', () => {
      controller.run();
      expect(mockCpuService.computer).toHaveBeenCalledWith(4, 6);
    });

    it('should call DiskService when reading', () => {
      controller.run();
      expect(mockDiskService.getData).toHaveBeenCalled();
    });
  });
});
