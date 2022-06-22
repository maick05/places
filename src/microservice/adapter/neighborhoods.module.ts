import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PuppeteerModule } from 'nest-puppeteer';
import { NeighborhoodsController } from './controller/neighborhoods.controller';
import { GuiaMaisRepository } from './repository/neighborhoods/puppeteer/guia-mais.repository';
import { GetNeighborhoodsByCityService } from '../domain/service/neighborhoods/get-neighborhoods-by-city.service';
import configuration from '../../config/configuration';
import { NeighborhoodsMongoose } from './repository/neighborhoods/neighborhoods-mongoose.repository';
import {
  Neighborhood,
  NeighborhoodSchema
} from '../domain/schemas/neighborhood.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SaveNeighborhoodsByCityService } from '../domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { Country, CountrySchema } from '../domain/schemas/country.schema';
import { GetCountryByNameOrAliasService } from '../domain/service/countries/get-country-by-name-or-alias.service';
import { CountriesMongoose } from './repository/countries/countries-mongoose.repository';
import { State, StateSchema } from '../domain/schemas/state.schema';
import { GetStateByNameOrAliasService } from '../domain/service/states/get-state-by-name-or-alias.service';
import { StatesMongoose } from './repository/states/states-mongoose.repository';

@Module({
  imports: [
    PuppeteerModule.forFeature(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Country.name, schema: CountrySchema },
      { name: State.name, schema: StateSchema }
    ])
  ],
  controllers: [NeighborhoodsController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    NeighborhoodsMongoose,
    CountriesMongoose,
    StatesMongoose,
    GetNeighborhoodsByCityService,
    SaveNeighborhoodsByCityService,
    GetCountryByNameOrAliasService,
    GetStateByNameOrAliasService
  ]
})
export class NeighborhoodsModule {}
