import { Controller, Get } from '@nestjs/common';
import { CpuService } from '../cpu/cpu.service';
import { DiskService } from '../disk/disk.service';

@Controller('computer')
export class ComputerController {
    constructor(private cpuService: CpuService, private diskService: DiskService) {}
    
    @Get('/run')
    run() {
        return[this.cpuService.computer(4,6), this.diskService.getData()];
    }
}
