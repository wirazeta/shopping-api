import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAdminGuard } from '../guard/is-admin/is-admin.guard';
import { AuthGuardGuard } from '../guard/auth-guard/auth-guard.guard';
import { IsOwnerGuard } from '../guard/is-owner/is-owner.guard';

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
        statusCode: HttpStatus.NOT_FOUND,
        data: []
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'All User Found',
      statusCode: HttpStatus.OK,
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
        statusCode: HttpStatus.NOT_FOUND,
        data: result
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'User Found',
      statusCode: HttpStatus.OK,
      data: result
    })
  }

  @UseGuards(AuthGuardGuard, IsOwnerGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    const result = await this.usersService.update(+id, updateUserDto);
    if (result === null || result === undefined) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Update Failed',
        statusCode: HttpStatus.BAD_REQUEST,
        data: result
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Update Success',
      statusCode: HttpStatus.OK,
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
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Delete Success',
      statusCode: HttpStatus.OK
    })
  }
}
