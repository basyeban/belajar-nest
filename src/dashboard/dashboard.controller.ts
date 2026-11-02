import { Controller, Get, Post, Headers, Query } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly firebaseService: FirebaseService) {}

  private resolveUserId(headerUserId?: string, queryUserId?: string): string {
    return headerUserId || queryUserId || process.env.DEFAULT_USER_ID || 'user_id_123';
  }

  @Get('stats')
  async getDashboardStats(
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const stats = await this.firebaseService.getDashboardStats(userId);
    return {
      statusCode: 200,
      message: 'Berhasil mengambil statistik dasbor CelenganKu',
      data: stats,
    };
  }

  @Post('reset')
  async resetAllData(
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const result = await this.firebaseService.clearAllData(userId);
    return {
      statusCode: 200,
      message: result.message,
    };
  }
}
