import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity.js';
import { Character } from '../characters/entities/character.entity.js';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private teamsRepo: Repository<Team>,
    @InjectRepository(Character) private charactersRepo: Repository<Character>,
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

  async create(createTeamDto: any) {
    const exists = await this.teamsRepo.findOne({ where: { name: createTeamDto.name } });
    if (exists) throw new ConflictException('Name already exists'); 

    const team = this.teamsRepo.create(createTeamDto);
    return this.teamsRepo.save(team);
  }

  async update(id: number, updateTeamDto: any) {
    const team = await this.teamsRepo.findOne({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');

    if (updateTeamDto.name && updateTeamDto.name !== team.name) {
      const exists = await this.teamsRepo.findOne({ where: { name: updateTeamDto.name } });
      if (exists) throw new ConflictException('Name already exists');
    }

    Object.assign(team, updateTeamDto);
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