import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty({ message: 'Nama target / impian wajib diisi' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Nominal target wajib diisi' })
  @IsNumber({}, { message: 'Nominal target harus berupa angka' })
  @Min(1000, { message: 'Nominal target minimal Rp 1.000' })
  target: number;

  @IsNotEmpty({ message: 'Kategori target wajib dipilih' })
  @IsString()
  category: string;

  @IsNotEmpty({ message: 'Target tenggat waktu wajib diisi' })
  @IsString()
  targetDate: string;

  @IsOptional()
  @IsString()
  color?: string = 'emerald';

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Saldo awal tidak boleh negatif' })
  current?: number = 0;
}

