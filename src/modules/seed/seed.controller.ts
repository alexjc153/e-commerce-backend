import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Seed database',
    description:
      'This endpoint destroy all data in database and insert new data',
  })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
