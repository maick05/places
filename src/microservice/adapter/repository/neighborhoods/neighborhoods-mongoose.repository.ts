import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchNeighborhoods } from 'src/microservice/domain/model/search/search-neighborhoods.model';
import { MongooseRepository } from '../../../domain/repository/mongoose.repository';
import {
  Neighborhood,
  NeighborhoodDocument
} from '../../../domain/schemas/neighborhood.schema';

@Injectable()
export class NeighborhoodsMongoose extends MongooseRepository<Neighborhood> {
  constructor(
    @InjectModel(Neighborhood.name)
    model: Model<NeighborhoodDocument>
  ) {
    super(model);
  }

  async findBySearchParams(
    searchParams: SearchNeighborhoods
  ): Promise<Neighborhood[]> {
    return this.model.find(searchParams).select({ _id: 0 }).lean().exec();
  }
}