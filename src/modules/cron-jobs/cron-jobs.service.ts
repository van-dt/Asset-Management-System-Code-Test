import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from '../../core/global/prisma/prisma.service';
import { AssetData } from '../../core/types';
import { EStatus } from '../../core/enum';
import { Device } from '@prisma/client';
import { handleErrorStatus } from '../../helper/utils';

@Injectable()
export class CronJobsService {
  private readonly logger = new Logger(CronJobsService.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private async getAssetsDataFromApi() {
    const assetsApiUrl = this.configService.get('assetsApiUrl');
    try {
      const res = await axios.get(assetsApiUrl);
      return res.data;
    } catch (error) {
      const status = error.response?.status || 500;
      handleErrorStatus(status);
    }
  }

  private async getNewAssetData(): Promise<Device[]> {
    const assetData: AssetData[] = await this.getAssetsDataFromApi();

    const locationAssets = assetData.map((asset) => asset.location_id);
    const locationAssetIdsUnique = [...new Set(locationAssets)];

    const locations = await this.prisma.location.findMany({
      select: { location_id: true },
      where: {
        status: EStatus.ACTIVED,
      },
    });
    const locationIds = locations.map((location) => location.location_id);
    const locationNeedSyncIds = locationAssetIdsUnique.filter((locationId) =>
      locationIds.includes(locationId),
    );

    const newAssetData: Device[] = assetData.reduce((result, asset) => {
      if (locationNeedSyncIds.includes(asset.location_id)) {
        result.push({
          id: asset.id,
          type: asset.type,
          serial: asset.serial,
          status: asset.status,
          description: asset.description,
          locationId: asset.location_id,
          createdAt: new Date(asset.created_at * 1000),
          updatedAt: new Date(asset.updated_at * 1000),
        });
      }
      return result;
    }, []);

    return newAssetData;
  }

  private async updateDeviceData(newAssetData: Device[]) {
    await this.prisma.$transaction(async (tx) => {
      const updateDeviceDataPromises = newAssetData.map((asset) => {
        return tx.device.upsert({
          where: { id: asset.id },
          update: asset,
          create: asset,
        });
      });
      await Promise.all(updateDeviceDataPromises);
    });
  }

  // Synchronous database at 00:00:00 UTC
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncDatabase() {
    this.logger.log('Start synchronous database');
    try {
      const newAssetData = await this.getNewAssetData();
      await this.updateDeviceData(newAssetData);
    } catch (error) {
      this.logger.error(`${error}`);
    }
    this.logger.log('Synchronous database completed');
  }
}
