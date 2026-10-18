import { Controller, Get, Post, Put, Patch, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { TeamsService } from './teams.service.js';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() { return this.teamsService.findAll(); }

  @Get(':id') 
  findOne(@Param('id') id: string) { return this.teamsService.findOne(+id); }

  @Get(':id/characters') 
  findCharacters(@Param('id') id: string) { return this.teamsService.findCharacters(+id); }

  @Post() 
  create(@Body() createTeamDto: any) { return this.teamsService.create(createTeamDto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: any) { return this.teamsService.update(+id, updateTeamDto); }

  @Patch(':id/characters') 
  assignCharacters(@Param('id') id: string, @Body('characterIds') characterIds: number[]) { 
    return this.teamsService.assignCharacters(+id, characterIds); 
  }

  @Delete(':id') 
  @HttpCode(200) 
  remove(@Param('id') id: string) { return this.teamsService.remove(+id); }
}