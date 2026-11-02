import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Nominal target harus berupa angka' })
  @Min(1000, { message: 'Nominal target minimal Rp 1.000' })
  target?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  targetDate?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

