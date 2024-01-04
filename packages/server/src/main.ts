/* eslint-disable no-extend-native */
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import { Decimal } from '@prisma/client/runtime/library'
import BigNumber from 'bignumber.js'
import { AppModule } from './app.module'

Object.defineProperty(Decimal.prototype, 'toString', {
  get() { return () => new BigNumber(this.toHex()).toFixed() },
})
Object.defineProperty(Decimal.prototype, 'toJSON', {
  get() { return () => new BigNumber(this.toHex()).toFixed() },
})
Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() { return () => String(this) },
})

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('geoscriptions')
    .setDescription('geoscriptions api')
    .setVersion('1.0.0')
    .build()

  const app = await NestFactory.create(AppModule)
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('swagger/website', app, document, {
    jsonDocumentUrl: 'swagger/json',
  })

  app.enableCors()
  await app.listen(process.env.NEST_LISTEN_SERVER_PORT)
  new Logger('Nest').log(`The server has started and is listening on port ${process.env.NEST_LISTEN_SERVER_PORT}`)
}
bootstrap()
