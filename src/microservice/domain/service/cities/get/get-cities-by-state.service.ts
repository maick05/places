import { Injectable } from '@nestjs/common';
import { CitiesMongoose } from '../../../../adapter/repository/cities/cities-mongoose.repository';
import { CityResponse } from '../../../model/cities/city-response.model';
import { SearchCitiesDB } from '../../../model/search/cities/search-cities-db.model';
import { SearchCitiesDTO } from '../../../model/search/cities/search-cities-dto.model';
import { City } from '../../../schemas/city.schema';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { CitiesService } from '../cities.service';

@Injectable()
export class GetCitiesByStateService extends CitiesService {
  constructor(
    mongoRepository: CitiesMongoose,
    protected readonly validateService: ValidateInputParamsService
  ) {
    super(mongoRepository);
  }

  async getCitiesByState(
    searchParams: SearchCitiesDTO
  ): Promise<CityResponse[]> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByState(searchParams);

    const searchDB = new SearchCitiesDB(
      convertedSearch.country.id,
      convertedSearch.state.id
    );

    this.logger.log('Searching cities in database...');

    return this.findCitiesByState(searchDB);
  }

  async findCitiesByState(
    searchParams: SearchCitiesDB,
    arrIgnore = []
  ): Promise<City[]> {
    if (arrIgnore.length > 0) searchParams.id = { $nin: arrIgnore };
    const select = {
      _id: 0,
      id: 1,
      name: 1,
      countryId: 1,
      countryCode: 1,
      stateId: 1,
      stateCode: 1
    };
    return this.mongoRepository.findBySearchParams(searchParams, select);
  }
}
