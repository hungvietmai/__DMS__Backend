import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type FilterQuery } from 'mongoose';

import type { CreateServiceCatalogDto } from './dto/create-service-catalog.dto.js';
import type { UpdateServiceCatalogDto } from './dto/update-service-catalog.dto.js';
import { ServiceCatalog, type ServiceCatalogDocument } from './schemas/service-catalog.schema.js';

@Injectable()
export class ServiceCatalogService {
  constructor(
    @InjectModel(ServiceCatalog.name)
    private readonly catalogModel: Model<ServiceCatalogDocument>,
  ) {}

  /** Create a new service */
  async create(dto: CreateServiceCatalogDto): Promise<ServiceCatalogDocument> {
    const created = new this.catalogModel({
      serviceCode: dto.serviceCode,
      serviceName: dto.serviceName,
      unitPrice: dto.unitPrice,
      unit: dto.unit,
      isAvailable: true,
    });
    return created.save();
  }

  /** List all services, optional 'available' filter */
  async findAll(available?: boolean): Promise<ServiceCatalogDocument[]> {
    const filter: FilterQuery<ServiceCatalogDocument> = {};
    if (available !== undefined) filter.isAvailable = available;
    return this.catalogModel.find(filter).sort({ serviceCode: 1 }).exec();
  }

  /** Fetch one by ID */
  async findOne(id: string): Promise<ServiceCatalogDocument> {
    const doc = await this.catalogModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Service ${id} not found`);
    return doc;
  }

  /** Update name, price, unit, or availability */
  async update(id: string, dto: UpdateServiceCatalogDto): Promise<ServiceCatalogDocument> {
    const updated = await this.catalogModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Service ${id} not found`);
    return updated;
  }

  /** Disable a service (hide from new usage) */
  async disable(id: string): Promise<ServiceCatalogDocument> {
    const doc = await this.catalogModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Service ${id} not found`);
    doc.isAvailable = false;
    return doc.save();
  }

  /** Restore a disabled service */
  async restore(id: string): Promise<ServiceCatalogDocument> {
    const doc = await this.catalogModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Service ${id} not found`);
    doc.isAvailable = true;
    return doc.save();
  }
}
