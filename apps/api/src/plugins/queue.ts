import amqp from "amqplib";
import fastifyPlugin from "fastify-plugin";
import config from "../config.js";

export const queuePlugin = fastifyPlugin(async (app) => {
  const connection = await amqp.connect(config.RABBITMQ_URL , {
    keepAlive : true,
    

  });
  connection.on("error", (err) => {
    app.log.error(err, "RabbitMQ connection error");
  });
  connection.on("close", () => {
    app.log.warn("RabbitMQ connection closed");
  });

  const channel = await connection.createChannel();
  app.log.info("RabbitMQ connected");
  app.decorate("queueConnection", connection);
  app.decorate("queueChannel", channel);
});
