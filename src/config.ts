import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT) || 5432,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      refresh_secret: process.env.REFRESH_SECRET,
    },
    server: {
      host: process.env.HOST,
      port: parseInt(process.env.PORT) || 3000,
    },
  };
});
