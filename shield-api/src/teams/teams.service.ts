import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity.js';
import { Character } from '../characters/entities/character.entity.js';
import { Repository, In, DataSource } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto.js';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private teamsRepo: Repository<Team>,
    @InjectRepository(Character) private charactersRepo: Repository<Character>,
    private readonly dataSource: DataSource,
  ) {}


  async findAll() {
    return this.teamsRepo.find();
  }

  async findOne(id: number) {
    const team = await this.teamsRepo.findOne({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async findCharacters(id: number) {
    const team = await this.teamsRepo.findOne({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');
    return this.charactersRepo.find({ where: { team_id: id } });
  }

  
async create(createTeamDto: CreateTeamDto) {
  const { characterIds = [], ...teamData } = createTeamDto;

  const exists = await this.teamsRepo.findOne({
    where: { name: teamData.name },
  });

  if (exists) {
    throw new ConflictException('Name already exists');
  }

  if (characterIds.length > 0 && teamData.active === false) {
    throw new BadRequestException('Team is not active');
  }

  return this.dataSource.transaction(async (manager) => {
    const teamsRepo = manager.getRepository(Team);
    const charactersRepo = manager.getRepository(Character);

    const characters = characterIds.length > 0
      ? await charactersRepo.findBy({
          id: In(characterIds),
        })
      : [];

    if (characters.length !== characterIds.length) {
      throw new NotFoundException(
        'One or more characters not found',
      );
    }

    const team = teamsRepo.create(teamData);
    const savedTeam = await teamsRepo.save(team);

    if (characters.length > 0) {
      for (const character of characters) {
        character.team = savedTeam;
      }

      await charactersRepo.save(characters);
    }

    return savedTeam;
  });
}


  async update(id: number, updateTeamDto: any) {
    const team = await this.teamsRepo.findOne({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');

    if (updateTeamDto.name && updateTeamDto.name !== team.name) {
      const exists = await this.teamsRepo.findOne({ where: { name: updateTeamDto.name } });
      if (exists) throw new ConflictException('Name already exists');
    }

    Object.assign(team, {
      name: updateTeamDto.name,
      base: updateTeamDto.base ?? null,
      founded_year: updateTeamDto.founded_year ?? null,
      active: updateTeamDto.active,
    });
    return this.teamsRepo.save(team);
  }

  async remove(id: number) {
    const team = await this.teamsRepo.findOne({ where: { id }, relations: { characters: true } });
    if (!team) throw new NotFoundException('Team not found'); 
    
    if (team.characters && team.characters.length > 0) {
      throw new ConflictException('Cannot delete team with assigned characters'); 
    }
    await this.teamsRepo.delete(id);
  }

  async assignCharacters(teamId: number, characterIds: number[]) {
    const team = await this.teamsRepo.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found'); 
    if (!team.active) throw new BadRequestException('Team is not active'); 

    const characters = await this.charactersRepo.findBy({ id: In(characterIds) });
    if (characters.length !== characterIds.length) {
      throw new NotFoundException('One or more characters not found'); 
    }

    for (const char of characters) {
      char.team = team;
      await this.charactersRepo.save(char);
    }
    return team;
  }
}