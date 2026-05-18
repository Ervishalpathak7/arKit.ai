import { log } from "@/config/logger.js";
import { Infra } from "@/interface/infra.js";
import { Channel, ChannelModel, connect } from "amqplib";

export class RabbitMQ implements Infra {
  private connection!: ChannelModel;
  public channel!: Channel;

  constructor(private readonly url: string) {}

  async connect() {
    this.connection = await connect(this.url);
    this.channel = await this.connection.createChannel();
    log.info({ infra: "rabbitmq" }, `rabbitmq connected`);
  }

  async disconnect() {
    await this.channel.close();
    await this.connection.close();
    log.info({ infra: "rabbitmq" }, `rabbitmq disconnected`);
  }

  async healthCheck() {
    if (!this.connection) throw new Error("rabbitmq connection missing");
    if (!this.channel) throw new Error("rabbitmq channel missing");
    await this.channel.checkQueue("health-check");
  }
}
