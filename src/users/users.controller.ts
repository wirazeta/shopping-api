import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAdminGuard } from 'src/guard/is-admin/is-admin.guard';
import { AuthGuardGuard } from 'src/guard/auth-guard/auth-guard.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuardGuard, IsAdminGuard)
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

  @UseGuards(AuthGuardGuard)
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

  @UseGuards(AuthGuardGuard)
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

  @UseGuards(AuthGuardGuard, IsAdminGuard)
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
