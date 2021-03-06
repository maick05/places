import { Injectable } from '@nestjs/common';
import { LogSeedMongoose } from '../../../adapter/repository/logseed/logseed-mongoose.repository';
import { EnumTypeLogSeed } from '../../enumerators/enum-type-logseed';
import { City } from '../../schemas/city.schema';
import { Country } from '../../schemas/country.schema';
import {
  LogSeed,
  ReferenceLogSeed,
  ReferenceNeighborhoodsByState
} from '../../schemas/logseed.schema';
import { State } from '../../schemas/state.schema';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class LogSeedJobService extends AbstractService {
  constructor(protected readonly mongoRepository: LogSeedMongoose) {
    super();
  }

  private async createLogSeed(
    type: EnumTypeLogSeed,
    reference: ReferenceLogSeed,
    error: Error
  ) {
    this.logger.log('Logging seed error....');
    const logSeed = new LogSeed();
    logSeed.type = type;
    logSeed.reference = reference;
    logSeed.datetime = new Date();
    logSeed.ip = 'localhost';
    logSeed.success = false;
    logSeed.processed = false;
    logSeed.error = error;
    await this.mongoRepository.insertOne(logSeed, 'Log Seed Job');
  }

  async logSeedByState(
    country: Country,
    state: State,
    city: City,
    error: Error
  ) {
    const reference = new ReferenceNeighborhoodsByState(
      country.id,
      state.id,
      city.id,
      country.name,
      state.name,
      city.name
    );
    await this.createLogSeed(
      EnumTypeLogSeed.NeighborhoodsByState,
      reference,
      error
    );
  }
}
