import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { GoalsService } from './goals.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';

@Controller('api/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  private resolveUserId(headerUserId?: string, queryUserId?: string): string {
    return headerUserId || queryUserId || process.env.DEFAULT_USER_ID || 'user_id_123';
  }

  @Get()
  async getGoals(
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const goals = await this.goalsService.findAll(userId);
    return {
      statusCode: 200,
      message: 'Berhasil mengambil daftar target tabungan',
      data: goals,
    };
  }

  @Get(':id')
  async getGoalById(
    @Param('id') id: string,
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const goal = await this.goalsService.findOne(userId, id);
    return {
      statusCode: 200,
      data: goal,
    };
  }

  @Post()
  async createGoal(
    @Body() createGoalDto: CreateGoalDto,
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const newGoal = await this.goalsService.create(userId, createGoalDto);
    return {
      statusCode: 201,
      message: 'Target tabungan berhasil dibuat',
      data: newGoal,
    };
  }

  @Put(':id')
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const updatedGoal = await this.goalsService.update(userId, id, updateGoalDto);
    return {
      statusCode: 200,
      message: 'Target tabungan berhasil diperbarui',
      data: updatedGoal,
    };
  }

  @Delete(':id')
  async deleteGoal(
    @Param('id') id: string,
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const result = await this.goalsService.remove(userId, id);
    return {
      statusCode: 200,
      message: result.message,
    };
  }
}
