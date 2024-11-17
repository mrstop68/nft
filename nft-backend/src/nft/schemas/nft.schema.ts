import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NftDocument = Nft & Document;

@Schema({ timestamps: true })
export class Nft {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['image', 'video'] })
  type: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
