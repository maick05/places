import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  subscribeSeedByCityError,
  subscribeSeedByCitySucess as subscribeSeedByCitySuccess
} from '../../../../../../config/amqp/rabbitmq-subscribe.config';
import {
  MessageSeedNeighborhoodsByCityErrorDTO,
  MessageSeedNeighborhoodsByCitySuccessDTO
} from '../../../../model/dto/messages/message-seed-neighborhoods-by-city-dto.model';
import { GetNeighborhoodsByCityService } from '../../../neighborhoods/get/get-neighborhoods-by-city.service';
import { MissingSeedException } from '../../../../../../core/error-handling/exception/missing-seed.exception';
import { JobSeedNeighborhoodsService } from '../abstract/job-seed-neighborhoods.service';
import { LogSeedJobService } from '../../../logseed/log-seed-job.service';
import { GetLogSeedByIdService } from '../../../logseed/get-log-seed-by-id.service';

@Injectable()
export class ProcessSeedNeighborhoodsByCityService extends JobSeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly logSeedService: LogSeedJobService,
    @Inject(forwardRef(() => GetNeighborhoodsByCityService))
    private readonly getLogSeedByIdService: GetLogSeedByIdService,
    private readonly getNeighborhoodsService: GetNeighborhoodsByCityService
  ) {
    super(validateService, logSeedService);
  }

  @RabbitSubscribe(subscribeSeedByCitySuccess)
  public async readSuccess(msg: MessageSeedNeighborhoodsByCitySuccessDTO) {
    this.logger.log(
      `Reading seed success for City[${msg.reference.cityId}] - ${msg.reference.cityName}`
    );
    const searchParams = new SearchNeighborhoodsDTO(
      msg.reference.country,
      msg.reference.stateCode,
      msg.reference.cityName
    );

    const convertedSearch =
      await this.validateService.validateAndConvertSearchByCity(searchParams);

    const resMongo =
      await this.getNeighborhoodsService.findNeighborhoodsByCityInDatabase(
        convertedSearch
      );

    if (resMongo.length < msg.seededCount) {
      await this.logErrorSeedJob(
        convertedSearch,
        convertedSearch.city,
        new MissingSeedException(
          resMongo.length,
          msg.seededCount,
          'neighborhood'
        )
      );
    }
    this.logger.log('Seed Job successfully done!');
  }

  @RabbitSubscribe(subscribeSeedByCityError)
  public async readError(msg: MessageSeedNeighborhoodsByCityErrorDTO) {
    this.logger.log(
      `Reading seed error for City[${msg.reference.cityId}] - ${msg.reference.cityName}`
    );

    const logSeed = await this.getLogSeedByIdService.getLogSeedById(
      msg.idLogSeed
    );

    this.logger.log('Seed Job successfully done!');
  }
}
