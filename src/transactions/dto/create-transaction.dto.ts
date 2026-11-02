import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'ID target tabungan (goalId) wajib diisi' })
  @IsString()
  goalId: string;

  @IsNotEmpty({ message: 'Tipe transaksi wajib diisi (deposit atau withdraw)' })
  @IsIn(['deposit', 'withdraw'], {
    message: 'Tipe transaksi hanya boleh "deposit" (menabung) atau "withdraw" (tarik dana)',
  })
  type: 'deposit' | 'withdraw';

  @IsNotEmpty({ message: 'Nominal transaksi wajib diisi' })
  @IsNumber({}, { message: 'Nominal transaksi harus berupa angka' })
  @Min(1, { message: 'Nominal transaksi minimal Rp 1' })
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  date?: string;
}

