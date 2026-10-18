import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Team } from '../../teams/entities/team.entity.js';
import { CharacterStatus } from '../enums/character-status.enum.js';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  real_name: string;

  @Column({ unique: true })
  alias: string;

  @Column()
  main_power: string;

  @Column({ type: 'int' })
  power_level: number;

  @Column({ type: 'enum', enum: CharacterStatus })
  status: CharacterStatus;

  @Column()
  is_villain: boolean;

  @Column({ nullable: true })
  team_id: number;

  @ManyToOne('Team', 'characters')
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}