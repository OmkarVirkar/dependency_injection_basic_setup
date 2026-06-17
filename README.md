

# di — NestJS Dependency Injection demo

Small NestJS application that demonstrates dependency injection (DI) using a simple computer analogy:
- A Computer exposes an HTTP controller.
- The Computer depends on CpuService and DiskService.
- CpuService and DiskService depend on a shared PowerService.

This project shows how to structure modules, providers, and exports so services can be injected across modules.

## Project structure (relevant files)

- src/main.ts — bootstrap (creates the Nest app from ComputerModule)
- src/computer/computer.module.ts — root feature module for the Computer (imports CpuModule and DiskModule; registers ComputerController)
- src/computer/computer.controller.ts — controller that consumes CpuService and DiskService via constructor injection
- src/cpu/cpu.module.ts — declares and exports CpuService; imports PowerModule
- src/cpu/cpu.service.ts — CpuService (depends on PowerService)
- src/disk/disk.module.ts — declares and exports DiskService; imports PowerModule
- src/disk/disk.service.ts — DiskService (depends on PowerService)
- src/power/power.module.ts — provides and exports PowerService
- src/power/power.service.ts — PowerService (shared provider)

## How DI is implemented here

- PowerService is declared in PowerModule and exported:
  - PowerModule: providers: [PowerService], exports: [PowerService]
- CpuModule and DiskModule import PowerModule so their services can receive PowerService instances:
  - imports: [PowerModule]; providers: [CpuService] / [DiskService]; exports: [CpuService] / [DiskService]
- ComputerModule imports CpuModule and DiskModule and exposes a controller that receives CpuService and DiskService via constructor injection.
- All injections use Nest's constructor injection and the framework's provider resolution (no manual wiring).

Example (conceptual):

```typescript
// constructor injection in a controller or service
constructor(
  private readonly cpuService: CpuService,
  private readonly diskService: DiskService,
) {}
```

This setup keeps services modular, easy to unit test (providers can be overridden), and simple to replace with mocks or alternative implementations.

## Run (macOS)

Install and start:
```bash
$ npm install
$ npm run start
# or watch mode
$ npm run start:dev
```

Run tests:
```bash
$ npm run test
```

## Notes

- To unit-test controllers/services, use Test.createTestingModule() and override providers with .overrideProvider(...).useValue(...) or .useClass(...).
- Use module exports to share providers across modules; prefer small focused modules to keep dependencies clear.
