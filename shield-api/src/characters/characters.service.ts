import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Character } from './entities/character.entity.js';
import { Team } from '../teams/entities/team.entity.js';
import { CharacterStatus } from './enums/character-status.enum.js';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private charactersRepo: Repository<Character>,
    @InjectRepository(Team) private teamsRepo: Repository<Team>,
  ) {}

  async findAll(status?: string, teamId?: string) {
    const where: FindOptionsWhere<Character> = {};
    if (status) where.status = status as CharacterStatus;
    if (teamId) where.team_id = +teamId;
    return this.charactersRepo.find({ where, relations: { team: true } });
  }

  async findOne(id: number) {
    const character = await this.charactersRepo.findOne({ where: { id }, relations: { team: true } });
    if (!character) throw new NotFoundException('Character not found');
    return character;
  }

  async create(dto: any) {
    const exists = await this.charactersRepo.findOne({ where: { alias: dto.alias } });
    if (exists) throw new ConflictException('Alias already exists'); 

    if (dto.team_id) {
      const team = await this.teamsRepo.findOne({ where: { id: dto.team_id } });
      if (!team) throw new NotFoundException('Team not found'); 
      if (!team.active) throw new BadRequestException('Team is not active'); 
    }

    const character = this.charactersRepo.create(dto);
    return this.charactersRepo.save(character);
  }

  async update(id: number, dto: any) {
    const character = await this.charactersRepo.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Character not found');

    if (dto.alias && dto.alias !== character.alias) {
      const exists = await this.charactersRepo.findOne({ where: { alias: dto.alias } });
      if (exists) throw new ConflictException('Alias already exists');
    }

    if (dto.team_id) {
      const team = await this.teamsRepo.findOne({ where: { id: dto.team_id } });
      if (!team) throw new NotFoundException('Team not found');
      if (!team.active) throw new BadRequestException('Team is not active');
    }

    Object.assign(character, dto);
    return this.charactersRepo.save(character);
  }

  async remove(id: number) {
    const character = await this.charactersRepo.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Character not found');
    await this.charactersRepo.delete(id);
    return { deleted: true };
  }

  async updateStatus(id: number, status: CharacterStatus) {
    const character = await this.charactersRepo.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Character not found');

    if (character.status === CharacterStatus.RETIRED && status === CharacterStatus.INJURED) {
      throw new BadRequestException('RETIRED character cannot change directly to INJURED'); 
    }
    
    character.status = status;
    return this.charactersRepo.save(character);
  }
}