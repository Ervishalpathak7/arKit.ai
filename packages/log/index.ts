import pino from "pino";

type CreateLoggerOptions = {
  service: string;
  production?: boolean;
};

export const createAppLogger = ({
  service,
  production = false,
}: CreateLoggerOptions) => {
  return pino({
    level: production ? "info" : "debug",
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: pino.stdSerializers.err,
    },
    base: {
      service,
    },
    transport: production
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        },
  });
};