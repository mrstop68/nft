import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NftService } from './nft.service';
import { Nft } from './schemas/nft.schema';
import { CreateNftDto } from './dto/create-nft.dto';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order = 'desc',
    @Query('skip') skip = 0,
    @Query('limit') limit = 10,
  ): Promise<{ items: Nft[]; total: number }> {
    const filter: any = {};
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
    }

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    return this.nftService.findAll(filter, sort, Number(skip), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Nft> {
    return this.nftService.findOne(id);
  }

  @Post()
  async create(@Body() createNftDto: CreateNftDto): Promise<Nft> {
    return this.nftService.create(createNftDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNftDto: Partial<Nft>): Promise<Nft> {
    return this.nftService.update(id, updateNftDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Nft> {
    return this.nftService.delete(id);
  }
}
