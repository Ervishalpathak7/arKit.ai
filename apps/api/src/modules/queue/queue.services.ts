import type { Channel } from "amqplib";

export class QueueService {
  constructor(private channel: Channel) {}
  async enqueue(queue: string, payload: string) {
    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-queue-type": "quorum",
      },
    });
    this.channel.sendToQueue(queue, Buffer.from(payload));
    console.log(" [x] Sent %s", payload);
  }
}
