import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { CharactersService } from './characters.service.js';
import { CharacterStatus } from './enums/character-status.enum.js';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get() 
  findAll(@Query('status') status?: string, @Query('teamId') teamId?: string) { 
    return this.charactersService.findAll(status, teamId); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.charactersService.findOne(+id); }

  @Post() 
  create(@Body() createDto: any) { return this.charactersService.create(createDto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) { return this.charactersService.update(+id, updateDto); }

  @Patch(':id/status') 
  updateStatus(@Param('id') id: string, @Body('status') status: CharacterStatus) { 
    return this.charactersService.updateStatus(+id, status); 
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) { return this.charactersService.remove(+id); }
}