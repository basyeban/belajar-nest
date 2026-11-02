import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

export interface UserAccount {
  id: string;
  username: string;
  password: string; // Disimpan secara plain text sesuai instruksi
  name: string;
  email?: string;
  createdAt: string;
}

@Injectable()
export class AuthService {
  // Database pengguna (dimulai dalam keadaan kosong - tanpa akun uji coba)
  private users: Map<string, UserAccount> = new Map();

  constructor() {}

  async login(dto: LoginDto): Promise<{
    user: Omit<UserAccount, 'password'>;
    token: string;
  }> {
    const usernameKey = dto.username.trim().toLowerCase();
    const user = this.users.get(usernameKey);

    // Validasi login langsung membandingkan string password polos (tanpa hash)
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException(
        'Username atau password salah. Jika belum punya akun, silakan daftar di tab "Daftar Akun".',
      );
    }

    const { password, ...safeUser } = user;
    const token = `token_${user.id}_${Date.now()}`;

    return {
      user: safeUser,
      token,
    };
  }

  async register(dto: RegisterDto): Promise<{
    user: Omit<UserAccount, 'password'>;
    token: string;
  }> {
    const usernameKey = dto.username.trim().toLowerCase();

    if (this.users.has(usernameKey)) {
      throw new BadRequestException(
        `Username "${dto.username}" sudah digunakan. Silakan gunakan username lain.`,
      );
    }

    const id = `user_${Date.now()}`;
    const newUser: UserAccount = {
      id,
      username: dto.username.trim(),
      password: dto.password, // Disimpan plain text tanpa hash
      name: dto.name?.trim() || dto.username.trim(),
      email: dto.email?.trim() || `${dto.username.trim()}@celenganku.com`,
      createdAt: new Date().toISOString(),
    };

    this.users.set(usernameKey, newUser);

    const { password, ...safeUser } = newUser;
    const token = `token_${id}_${Date.now()}`;

    return {
      user: safeUser,
      token,
    };
  }

  async getProfile(userId: string): Promise<Omit<UserAccount, 'password'>> {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        const { password, ...safeUser } = user;
        return safeUser;
      }
    }
    throw new NotFoundException(`Pengguna dengan ID "${userId}" tidak ditemukan.`);
  }

  async getAllUsers(): Promise<Omit<UserAccount, 'password'>[]> {
    return Array.from(this.users.values()).map(({ password, ...u }) => u);
  }
}
