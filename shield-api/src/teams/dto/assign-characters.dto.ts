
import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  Min
} from 'class-validator';

export class AssignCharactersDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  characterIds: number[];
}
