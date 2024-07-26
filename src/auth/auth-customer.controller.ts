import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from '../customers/customers.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth/customer')
export class CustomerAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customersService: CustomersService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    const hashedPassword = await this.hashPassword(body.password);
    return this.customersService.create({
      ...body,
      password: hashedPassword,
      sessionId: '',
    });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
      this.customersService,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user, this.customersService);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req) {
    const user = req.user;
    return this.authService.logout(user, this.customersService);
  }

  @Get('health-check')
  async getHealth() {
    return { message: 'healthy' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return req.user;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
