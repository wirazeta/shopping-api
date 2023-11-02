import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res){
    const token = await this.authService.signUp(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'success',
      status: HttpStatus.CREATED,
      data: token
    });
  }
  
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
