import { IsString, IsNotEmpty, IsInt, Min, Max, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { CharacterStatus } from '../enums/character-status.enum.js';

export class CreateCharacterDto {
  @IsString() @IsNotEmpty()
  real_name: string;

  @IsString() @IsNotEmpty()
  alias: string;

  @IsString() @IsNotEmpty()
  main_power: string;

  @IsInt() @Min(1) @Max(100)
  power_level: number; 

  @IsEnum(CharacterStatus)
  status: CharacterStatus; 

  @IsBoolean()
  is_villain: boolean;

  @IsOptional() @IsInt()
  team_id?: number;
}