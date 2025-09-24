const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info", // bisa diganti ke 'debug', 'warn', 'error'
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    // kalau butuh simpan ke file lokal:
    // new transports.File({ filename: "logs/app.log" })
  ],
});

module.exports = logger;
