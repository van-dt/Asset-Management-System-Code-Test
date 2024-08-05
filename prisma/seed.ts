import { EStatus, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // seed location data
  const danang = await prisma.location.upsert({
    where: { location_id: 1 },
    update: {},
    create: {
      location_id: 1,
      location_name: 'Da Nang',
      organization: 'PNS',
      status: EStatus.actived,
    },
  });

  const hanoi = await prisma.location.upsert({
    where: { location_id: 2 },
    update: {},
    create: {
      location_id: 2,
      location_name: 'Ha Noi',
      organization: 'PNS',
      status: EStatus.unactive,
    },
  });

  const hochiminh = await prisma.location.upsert({
    where: { location_id: 3 },
    update: {},
    create: {
      location_id: 3,
      location_name: 'Ho Chi Minh',
      organization: 'PNS',
      status: EStatus.actived,
    },
  });

  const nhatrang = await prisma.location.upsert({
    where: { location_id: 4 },
    update: {},
    create: {
      location_id: 4,
      location_name: 'Nha Trang',
      organization: 'PLJ',
      status: EStatus.actived,
    },
  });

  const cantho = await prisma.location.upsert({
    where: { location_id: 5 },
    update: {},
    create: {
      location_id: 5,
      location_name: 'Can Tho',
      organization: 'PLJ',
      status: EStatus.actived,
    },
  });
  console.log({ danang, hanoi, hochiminh, nhatrang, cantho });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
