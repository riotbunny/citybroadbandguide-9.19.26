const fs = require('fs');
let data = fs.readFileSync('src/app/internet/[state]/[city]/page.tsx', 'utf8');

const oldLogic = `    // 2. Aggregate City-Wide Provider Data
    const coverages = await prisma.coverage.findMany({
      where: { zip: { in: zipCodes } },
      include: {
        carrier: {
          include: { plans: true }
        }
      }
    });

    const activeCarriersMap = new Map();
    let highestSpeed = 0;
    let fastestCarrier: any = null;
    let lowestPrice = 999;
    let cheapestCarrier: any = null;

    coverages.forEach(cov => {
      if (cov.carrier && cov.carrier.isActive) {
        if (!activeCarriersMap.has(cov.carrier.id)) {
          activeCarriersMap.set(cov.carrier.id, cov.carrier);
        }
        if (cov.carrier.plans) {
          cov.carrier.plans.forEach((p: any) => {
            const speed = Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0);
            if (speed > highestSpeed) { highestSpeed = speed; fastestCarrier = cov.carrier; }
            if (p.price > 0 && p.price < lowestPrice) { lowestPrice = p.price; cheapestCarrier = cov.carrier; }
          });
        }
      }
    });`;

const newLogic = `    // 2. Aggregate City-Wide Provider Data
    const coverages = await prisma.coverage.findMany({
      where: { zip: { in: zipCodes } },
      include: {
        carrier: {
          include: { plans: true }
        }
      }
    });

    const nationwideCarriers = await prisma.carrier.findMany({
      where: { isNationwide: true, isActive: true },
      include: { plans: true }
    });

    const activeCarriersMap = new Map();
    let highestSpeed = 0;
    let fastestCarrier: any = null;
    let lowestPrice = 999;
    let cheapestCarrier: any = null;

    const processCarrier = (carrier: any) => {
      if (carrier && carrier.isActive) {
        if (!activeCarriersMap.has(carrier.id)) {
          activeCarriersMap.set(carrier.id, carrier);
        }
        if (carrier.plans) {
          carrier.plans.forEach((p: any) => {
            const speed = Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0);
            if (speed > highestSpeed) { highestSpeed = speed; fastestCarrier = carrier; }
            if (p.price > 0 && p.price < lowestPrice) { lowestPrice = p.price; cheapestCarrier = carrier; }
          });
        }
      }
    };

    coverages.forEach(cov => processCarrier(cov.carrier));
    nationwideCarriers.forEach(carrier => processCarrier(carrier));`;

data = data.replace(oldLogic, newLogic);
fs.writeFileSync('src/app/internet/[state]/[city]/page.tsx', data);