import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PlacesMongooseRepository } from '../../../domain/repository/mongoose/places-mongoose.repository';
import {
  Country,
  CountryDocument
} from '../../../domain/schemas/country.schema';

@Injectable()
export class CountriesMongoose extends PlacesMongooseRepository<
  Country,
  CountryDocument
> {
  constructor(
    @InjectModel(Country.name)
    model: Model<CountryDocument>,
    @InjectConnection() protected readonly connection: Connection
  ) {
    super(model, connection);
  }
}
