import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, HttpCode, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CharactersService } from './characters.service.js';
import { CharacterStatus } from './enums/character-status.enum.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { UpdateCharacterDto } from './dto/update-character.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Controller('characters')
export class CharactersController {
  constructor(
    private readonly charactersService: CharactersService,
  ) {}


  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('teamId') teamId?: string,
  ) {
    if (
      status !== undefined &&
      !Object.values(CharacterStatus).includes(
        status as CharacterStatus
      )
    ) {
      throw new BadRequestException(
        'status must be one of: ACTIVE, INJURED, MISSING, RETIRED'
      );
    }

    if (
      teamId !== undefined &&
      (
        !/^[1-9]\d*$/.test(teamId) ||
        !Number.isSafeInteger(Number(teamId))
      )
    ) {
      throw new BadRequestException(
        'teamId must be a positive integer'
      );
    }

    return this.charactersService.findAll(status, teamId);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateCharacterDto) {
    return this.charactersService.create(createDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, updateDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.charactersService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(id);
  }
}