import { Controller, Get, Post, Put, Patch, Delete, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { TeamsService } from './teams.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';
import { AssignCharactersDto } from './dto/assign-characters.dto.js';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() { return this.teamsService.findAll(); }

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  
  @Get(':id/characters')
  findCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findCharacters(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto
  ) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Patch(':id/characters')
  assignCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignCharactersDto
  ) {
    return this.teamsService.assignCharacters(id, dto.characterIds);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }

}
