import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Response, HttpStatus } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuardGuard } from 'src/guard/auth-guard/auth-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsOwnerGuard } from 'src/guard/is-owner/is-owner.guard';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  @UseGuards(AuthGuardGuard)
  async create(@Body() createItemDto: CreateItemDto, @Request() req, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      ],
      fileIsRequired: false
    })
  ) file: Express.Multer.File, @Response() res) {
    let data = { ...createItemDto, userId: req.user.user, image: null };
    if (file !== undefined) {
      data = { ...createItemDto, image: file.path, userId: req.user.user }
    }
    const result = await this.itemsService.create(data);
    if(result === null || result === undefined){
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Create Failed",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
    return res.status(HttpStatus.CREATED).json({
      message: "Create Success",
      statusCode: HttpStatus.CREATED,
      data: data
    });
  }

  @UseGuards(AuthGuardGuard)
  @Get()
  async findAll(@Response() res) {
    const result = await this.itemsService.findAll();
    if(result === null || result === undefined){
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "No Item Registered",
        statusCode: HttpStatus.NOT_FOUND
      });
    }
    return res.status(HttpStatus.OK).json({
      message: "All Items Found",
      statusCode: HttpStatus.OK,
      data: result
    });
  }

  @UseGuards(AuthGuardGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Response() res) {
    const result = await this.itemsService.findOne(+id);
    if(result === null){
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Item not found",
        statusCode: HttpStatus.NOT_FOUND
      });
    }
    return res.status(HttpStatus.OK).json({
      message: "Item found",
      statusCode: HttpStatus.OK,
      data: result
    });
  }

  @UseGuards(AuthGuardGuard, IsOwnerGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @Response() res) {
    const result = await this.itemsService.update(+id, updateItemDto);
    if(result === null || result === undefined){
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Update item failed",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
    return res.status(HttpStatus.OK).json({
      message: "Update item success",
      statusCode: HttpStatus.OK,
      data: result
    })
  }

  @UseGuards(AuthGuardGuard, IsOwnerGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Response() res) {
    const result = await this.itemsService.remove(+id);
    if( result === null || result === undefined){
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Delete item failed",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
    return res.status(HttpStatus.OK).json({
      message: "Delete item success",
      statusCode: HttpStatus.OK,
      data: result
    })
  }
}
