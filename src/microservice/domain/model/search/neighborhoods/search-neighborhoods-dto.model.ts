import { ApiProperty } from '@nestjs/swagger';
import { EmptyPropException } from 'src/core/error-handling/exception/empty-prop.exception';

export class DTO {
  validateIsAnyEmptyKey() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    Object.keys(this).forEach(function (key) {
      if (context[key].length === 0) throw new EmptyPropException(key);
    });
  }
}

export class SearchNeighborhoodsDTO extends DTO {
  @ApiProperty({
    type: String,
    description: 'The name of the Neighborhood'
  })
  public name: string;

  @ApiProperty({
    type: String,
    description: 'The country of the Neighborhood'
  })
  public country: string;

  @ApiProperty({
    type: String,
    description: 'The state of the Neighborhood'
  })
  public state: string;

  @ApiProperty({
    type: String,
    description: 'The city of the Neighborhood'
  })
  public city: string;

  constructor(country: string, state: string, city: string = null) {
    super();
    this.country = country;
    this.state = state;
    this.city = city;
  }

  setName(name: string) {
    this.name = name;
  }
}
