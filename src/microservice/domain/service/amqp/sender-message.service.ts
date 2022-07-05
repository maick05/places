import { AmqplibService } from '@ccmos/nestjs-amqplib';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { NestResponse } from 'src/core/http/nest-response';
import { NestResponseBuilder } from 'src/core/http/nest-response.builder';
import { EnumConfigAMQP } from 'src/microservice/adapter/helper/config/config.helper';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class SenderMessageService extends AbstractService {
  constructor(
    private readonly amqplib: AmqplibService,
    @Inject('CLIENT_SERVICE') private client: ClientProxy,
    private configService: ConfigService
  ) {
    super();
  }

  async emitEvent(configPattern: string, payload: object) {
    const eventPattern = this.configService.get<string>(
      `${EnumConfigAMQP.EVENT}.${configPattern}`
    );
    this.logger.log(`Emmiting event '${eventPattern}'...`);
    await this.client.emit<string>(eventPattern, payload);
    return {
      success: true,
      response: 'Event emmited!'
    };
  }

  async sendMessageToQueue(queue: string, payload: object) {
    // queue = this.configService.get<string>(
    //   `microservices.rabbitmq.queue.${queue}`
    // );
    this.logger.log(`Sending message to queue: ${queue}...`);
    // await this.amqplib.sendToQueue({ queue, payload });

    await this.amqplib.sendToQueue({ queue, payload });
    // await this.client.send<string>({ cmd: 'seed-by-city' }, payload);
    this.logger.log('Message sent!');

    return {
      success: true,
      response: 'Message sent!'
    };
  }

  @RabbitSubscribe({
    exchange: 'seed-exc',
    routingKey: 'sub-1',
    queue: 'seed-places-msg'
  })
  public async pubSubHandler(msg) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}