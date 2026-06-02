import { Channel, RabbitMQ } from "@archiq/queue";

export class RabbitMqService {
  private channel: Channel;
  private assertedQueues: Set<string>;
  constructor(private Rabbitmq: RabbitMQ) {
    this.channel = this.Rabbitmq.getChannel();
    this.assertedQueues = new Set();
  }

  assert = async (queue: string) => {
    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-queue-type": "quorum",
      },
    });
  };

  produce = async (queue: string, payload: string) => {
    if (!this.assertedQueues.has(queue)) {
      await this.assert(queue);
      this.assertedQueues.add(queue);
    }
    return this.channel.sendToQueue(queue, Buffer.from(payload));
  };
}
