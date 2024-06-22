// package imports
import winston from "winston";

// custom logger levels
const customLevels = {
  levels: {
    error: 0,
    info: 1,
  },
  colors: {
    error: "red",
    info: "cyan",
  },
};

// adding colors to messages
winston.addColors = customLevels.colors;

// creating a logger
export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "all-service" },
  transports: [new winston.transports.File({ filename: "combined.log" })],
});
