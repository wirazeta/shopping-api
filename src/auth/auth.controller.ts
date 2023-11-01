import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res() res){
    const token = await this.authService.signIn(signInDto.username, signInDto.password);
    return res.status(HttpStatus.OK).json({
      message: 'success',
      status: HttpStatus.OK,
      data: token
    });
  }
}
