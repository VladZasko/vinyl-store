import * as process from 'process';

export const configuration = () => ({
  aws: {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_BUCKET,
    DEFAULT_AVATAR: process.env.DEFAULT_AVATAR,
  },
  auth: {
    AUTH_LOGIN: process.env.AUTH_LOGIN,
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME,
    REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME,
    CONFIRMATION_CODE_TIME: process.env.CONFIRMATION_CODE_TIME,
  },
  db: {
    MONGO_URI: process.env.MONGO_URL,
  },
  google: {
    GOOGLE_MAIL_USER: process.env.GOOGLE_MAIL_USER,
    GOOGLE_MAIL_PASS: process.env.GOOGLE_MAIL_PASS,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  stripe: {
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_SECRET: process.env.STRIPE_SECRET,
  },
  telegram: {
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  },
  serveo: {
    SERVEO_URL: process.env.SERVEO_URL,
  },
  PORT: process.env.PORT,
});
