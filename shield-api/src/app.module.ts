import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TeamsModule } from './teams/teams.module.js';
import { CharactersModule } from './characters/characters.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5433,
      username: 'marvel',
      password: 'marvel123',
      database: 'marvel_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    TeamsModule,
    CharactersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
