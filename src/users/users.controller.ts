import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const result = await this.usersService.create(createUserDto);
    if (result === null || result === undefined) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Register Failed',
        status: HttpStatus.BAD_REQUEST,
        data: {}
      })
    }
    return res.status(HttpStatus.CREATED).json({
      message: 'Register Success',
      status: HttpStatus.CREATED,
      data: result
    })
  }

  @Get()
  async findAll(@Res() res) {
    const result = await this.usersService.findAll();
    if (result === null || result === undefined) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'No user registered',
        status: HttpStatus.NOT_FOUND,
        data: []
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'All User Found',
      status: HttpStatus.OK,
      data: result
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const result = await this.usersService.findOne(+id);
    if (result === null || result === undefined) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
        data: result
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'User Found',
      status: HttpStatus.OK,
      data: result
    })
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    const result = await this.usersService.update(+id, updateUserDto);
    if (result === null || result === undefined) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Update Failed',
        status: HttpStatus.BAD_REQUEST,
        data: result
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Update Success',
      status: HttpStatus.OK,
      data: result
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.usersService.remove(+id);
    if (result === null || result === undefined) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Delete Failed',
        status: HttpStatus.BAD_REQUEST,
        data: result
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Delete Success',
      status: HttpStatus.OK,
      data: result
    })
  }
}
