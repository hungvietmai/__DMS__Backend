import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema()
export class ServiceCatalog {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  serviceCode!: string;

  @Prop({ required: true, trim: true })
  serviceName!: string;

  @Prop({ required: true, min: 0 })
  unitPrice!: number;

  @Prop({ required: true, trim: true })
  unit!: string;

  /**
   * When false, hide from selection (e.g. under maintenance).
   * Past usages remain intact.
   */
  @Prop({ default: true })
  isAvailable!: boolean;
}

export type ServiceCatalogDocument = HydratedDocument<ServiceCatalog>;
export const ServiceCatalogSchema = SchemaFactory.createForClass(ServiceCatalog);

ServiceCatalogSchema.index({ serviceCode: 1 }, { unique: true });
