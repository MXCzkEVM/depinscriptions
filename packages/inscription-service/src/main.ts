import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { withEthersHttpProxy, withNestjsCors, withNestjsListen, withNestjsRepairDecimal, withNestjsSwagger } from './bootstrap'

async function bootstrap() {
  const { NEST_LISTEN_SERVER_PORT } = process.env
  const app = await NestFactory.create(AppModule)

  withEthersHttpProxy({ host: '127.0.0.1', port: 7890 })
  withNestjsRepairDecimal(app)
  withNestjsSwagger(app)
  withNestjsCors(app)
  withNestjsListen(app, NEST_LISTEN_SERVER_PORT)
}

bootstrap().catch((err) => {
  // tslint:disable-next-line:no-console
  console.error(err)
  process.exit(1)
})
