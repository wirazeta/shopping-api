import { Body, Controller, FileTypeValidator, ForbiddenException, Get, HttpCode, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      ],
      fileIsRequired: false
    })
  ) file: Express.Multer.File, @Res() res) {
    let data = { ...createUserDto, image: null };
    if (file !== undefined || file !== null) {
      console.log(file);
      data = { ...createUserDto, image: file.path }
    }
    const token = await this.authService.signUp(data);
    if(token === null){
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'failed',
        statusCode: HttpStatus.BAD_REQUEST,
        data: 'Username already registered'
      })
    }
    return res.status(HttpStatus.CREATED).json({
      message: 'success',
      statusCode: HttpStatus.CREATED,
      data: token
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res() res) {
    const token = await this.authService.signIn(signInDto.username, signInDto.password);
    if(token === null){
      throw new ForbiddenException;
    }
    return res.status(HttpStatus.OK).json({
      message: 'success',
      statusCode: HttpStatus.OK,
      data: token
    });
  }
}
