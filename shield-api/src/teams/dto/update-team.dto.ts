
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  MaxLength
} from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  base?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  founded_year?: number | null;

  @IsBoolean()
  active: boolean;
}
