import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Nft, NftDocument } from './schemas/nft.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NftService {
  constructor(@InjectModel(Nft.name) private nftModel: Model<NftDocument>) {}

  async findAll(filter: any, sort: any, skip: number, limit: number): Promise<{ items: Nft[]; total: number }> {
    const items = await this.nftModel.find(filter).sort(sort).skip(skip).limit(limit).exec();
    const total = await this.nftModel.countDocuments(filter);
    return { items, total };
  }

  async findOne(id: string): Promise<Nft> {
    return this.nftModel.findOne({ id }).exec();
  }

  async create(createNftDto: Partial<Nft>): Promise<Nft> {
    const newNft = new this.nftModel({
      ...createNftDto,
      id: uuidv4(),
      createdAt: new Date(),
    });
    return newNft.save();
  }

  async update(id: string, updateNftDto: Partial<Nft>): Promise<Nft> {
    return this.nftModel.findOneAndUpdate({ id }, updateNftDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Nft> {
    return this.nftModel.findOneAndDelete({ id }).exec();
  }
}
