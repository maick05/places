import { SearchNeighborhoodsDTO } from '../../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { IPuppeteerRepository } from './puppeteer-repository.interface';
import { EnumTranslations } from '../../../enumerators/enum-translations.enumerator';
import { ValidOutputSearchByCity } from '../../valid-output-search/valid-outpu-search.interface';

export interface IPuppeteerNeighborhoodRepository
  extends IPuppeteerRepository<
    NeighborhoodByCity,
    SearchNeighborhoodsDTO,
    ValidOutputSearchByCity
  > {
  language: EnumTranslations;
  getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsDTO,
    convertedSearch: ValidOutputSearchByCity
  ): Promise<NeighborhoodByCity[]>;
}
