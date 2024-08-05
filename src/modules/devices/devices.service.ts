import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/global/prisma/prisma.service';

@Injectable()
export class DevicesService {
  public constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const devices = await this.prisma.device.findMany({
      select: {
        id: true,
        type: true,
        serial: true,
        description: true,
        location: {
          select: {
            location_id: true,
            location_name: true,
            organization: true,
          },
        },
        status: true,
      },
    });

    const deviceRes = devices.map((device) => {
      const { location, ...rest } = device;
      return {
        ...rest,
        location_id: location.location_id,
        location_name: location.location_name,
        organization: location.organization,
      };
    });
    return deviceRes;
  }
}
