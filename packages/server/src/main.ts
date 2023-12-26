import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const options = new DocumentBuilder()
    .setTitle('geoscriptions')
    .setDescription('geoscriptions api')
    .setVersion('1.0.0')
    .build()

  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(process.env.NEST_LISTEN_SERVER_PORT)
}
bootstrap()
