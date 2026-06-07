import amqp from 'amqplib';
import { Channel } from 'amqplib';

let channel: Channel | null = null;
const DESIGN_QUEUE = 'design-queue';

export async function initQueue(url: string) {
  try {
    const conn = await amqp.connect(url);
    channel = await conn.createChannel();
    await channel.assertQueue(DESIGN_QUEUE, {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
      },
    });
  } catch (error) {
    channel = null;
    throw new Error(
      `Queue initialisation failed : ${(error as Error).message}`
    );
  }
}

export async function dissconnectQueue() {
  await getChannel().close();
  channel = null;
}

function getChannel(): Channel {
  if (!channel) {
    throw new Error('Queue not initialized. Call initQueue() first.');
  }
  return channel;
}

export async function enqueueDesign(payload: object) {
  const ch = getChannel();
  ch.sendToQueue(DESIGN_QUEUE, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
}

export async function consumeDesign(handler: (data: object) => Promise<void>) {
  const ch = getChannel();
  ch.consume(DESIGN_QUEUE, async msg => {
    if (!msg) return;
    try {
      await handler(JSON.parse(msg.content.toString()));
      ch.ack(msg);
    } catch (err) {
      // requeue: false sends it to dead-letter queue if configured, else drops it
      ch.nack(msg, false, false);
    }
  });
}
