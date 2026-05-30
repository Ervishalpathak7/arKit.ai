import { Infra } from "../interface.js";
import { Channel, ChannelModel, connect } from "amqplib";

export class RabbitMQ implements Infra {
  private connection!: ChannelModel;
  private channel!: Channel;

  constructor(private readonly url: string) {}

  async connect() {
    this.connection = await connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  async disconnect() {
    await this.channel.close();
    await this.connection.close();
  }

  getChannel() {
    return this.channel;
  }

  async healthCheck() {
    if (!this.connection) throw new Error("rabbitmq connection missing");
    if (!this.channel) throw new Error("rabbitmq channel missing");
    await this.channel.checkQueue("health-check");
  }
}
