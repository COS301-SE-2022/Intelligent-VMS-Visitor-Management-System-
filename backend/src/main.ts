import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { urlencoded, json } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    await app.listen(process.env.PORT || 3001);
}
bootstrap();
