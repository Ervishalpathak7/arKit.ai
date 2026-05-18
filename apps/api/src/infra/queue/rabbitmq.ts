import { Channel, ChannelModel, connect } from "amqplib";

export class RabbitMQ {
  private connection!: ChannelModel;
  public channel!: Channel;

  constructor(private readonly url: string) {}

  async connect() {
    this.connection = await connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  async disconnect() {
    await this.channel.close();
    await this.connection.close();
  }
}
