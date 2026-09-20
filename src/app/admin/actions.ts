'use server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function updateCarrier(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const affiliateUrl = formData.get('affiliateUrl') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const isActive = formData.get('isActive') === 'on';
  const isNationwide = formData.get('isNationwide') === 'on';
  const brandColor = formData.get('brandColor') as string;
  const hasFiber = formData.get('hasFiber') === 'on';
  const hasCable = formData.get('hasCable') === 'on';
  const has5G = formData.get('has5G') === 'on';
  const hasSatellite = formData.get('hasSatellite') === 'on';
  const disclaimer = formData.get('disclaimer') as string;
  const aboutText = formData.get('aboutText') as string;
  const rating = parseFloat(formData.get('rating') as string) || 4.5;

  let logoPathUpdate = undefined;
  const logo = formData.get('logo') as File | null;
  
  if (logo && logo.size > 0) {
    const buffer = Buffer.from(await logo.arrayBuffer());
    const safeName = logo.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `${Date.now()}-${safeName}`;
    const filepath = path.join(process.cwd(), 'public', 'logos', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    
    logoPathUpdate = `/logos/${filename}`;
  }

  const updateData: any = { name, affiliateUrl, phoneNumber, isActive, isNationwide, brandColor, hasFiber, hasCable, has5G, hasSatellite, disclaimer, aboutText, rating };
  if (logoPathUpdate) {
    updateData.logoPath = logoPathUpdate;
  }

  await prisma.carrier.update({
    where: { id },
    data: updateData
  });
  
  revalidatePath('/admin');
  revalidatePath('/');
  redirect(`/admin/carriers/${id}?success=${Date.now()}`);
}

export async function toggleCarrierStatus(id: string, newStatus: boolean) {
  await prisma.carrier.update({
    where: { id },
    data: { isActive: newStatus }
  });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function addCoverage(carrierId: string, formData: FormData) {
  const zipsRaw = formData.get('zips') as string;
  if (!zipsRaw) return;

  const zips = zipsRaw.split(',').map(z => z.trim()).filter(Boolean);
  
  const validLocations = await prisma.location.findMany({
    where: { zip: { in: zips } }
  });
  const validZips = validLocations.map(l => l.zip);

  // Find existing coverages to prevent unique constraint errors
  const existing = await prisma.coverage.findMany({
    where: { carrierId, zip: { in: validZips } }
  });
  const existingZips = new Set(existing.map(e => e.zip));

  // Instantly bulk-insert all missing zip codes in a single ultra-fast query
  const toCreate = validZips
    .filter(zip => !existingZips.has(zip))
    .map(zip => ({ carrierId, zip }));

  if (toCreate.length > 0) {
    await prisma.coverage.createMany({
      data: toCreate
    });
  }
  revalidatePath(`/admin/carriers/${carrierId}`);
}

export async function addCoverageByCity(carrierId: string, formData: FormData) {
  const citiesRaw = formData.get('cities') as string;
  if (!citiesRaw) return; 
  
  const stateRaw = formData.get('state') as string;
  const state = stateRaw ? stateRaw.trim().toUpperCase() : '';

  if (!state) return;

  const cityList = citiesRaw.split(',').map(c => {
    const trimmed = c.trim().toLowerCase();
    if (!trimmed) return '';
    return trimmed.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }).filter(Boolean);

  const validLocations = await prisma.location.findMany({
    where: { city: { in: cityList }, state: state }
  });
  
  const validZips = validLocations.map(l => l.zip);

  for (const zip of validZips) {
    await prisma.coverage.upsert({
      where: { carrierId_zip: { carrierId, zip } },
      update: {},
      create: { carrierId, zip }
    });
  }
  revalidatePath(`/admin/carriers/${carrierId}`);
}

export async function removeCoverage(coverageId: string, carrierId: string) {
  await prisma.coverage.delete({
    where: { id: coverageId }
  });
  revalidatePath(`/admin/carriers/${carrierId}`);
}

export async function addPlan(carrierId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string) || 0;
  const postPromoPriceStr = formData.get('postPromoPrice') as string;
  const peakLatencyStr = formData.get('peakLatency') as string;
  const dataCap = formData.get('dataCap') as string;

  let fccLabelPath = undefined;
  const fccLabel = formData.get('fccLabel') as File | null;
  if (fccLabel && fccLabel.size > 0) {
    const buffer = Buffer.from(await fccLabel.arrayBuffer());
    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `fcc-${Date.now()}-${safeName}`;
    const filepath = path.join(process.cwd(), 'public', 'labels', filename);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    fccLabelPath = `/labels/${filename}`;
  }
  const postPromoPrice = postPromoPriceStr ? parseFloat(postPromoPriceStr) : null;
  const peakLatency = peakLatencyStr ? parseInt(peakLatencyStr) : null;
  const downloadSpeedStr = formData.get('downloadSpeed') as string;
  const uploadSpeedStr = formData.get('uploadSpeed') as string;
  const description = formData.get('description') as string;

  const downloadSpeed = downloadSpeedStr ? parseInt(downloadSpeedStr) : null;
  const uploadSpeed = uploadSpeedStr ? parseInt(uploadSpeedStr) : null;

  await prisma.plan.create({
    data: {
      carrierId,
      name,
      price,
      postPromoPrice,
      peakLatency,
      dataCap,
      downloadSpeed,
      uploadSpeed,
      description,
      fccLabelImage: fccLabelPath
    }
  });
  revalidatePath(`/admin/carriers/${carrierId}`);
  revalidatePath('/');
}

export async function removePlan(planId: string, carrierId: string) {
  await prisma.plan.delete({ where: { id: planId } });
  revalidatePath(`/admin/carriers/${carrierId}`);
  revalidatePath('/');
}

export async function quickUpdateCarrier(id: string, formData: FormData) {
  const phoneNumber = formData.get('phoneNumber') as string;
  const affiliateUrl = formData.get('affiliateUrl') as string;

  await prisma.carrier.update({
    where: { id },
    data: { phoneNumber, affiliateUrl }
  });
  revalidatePath('/admin');
  revalidatePath('/');
}
export async function removeCoverageByCity(carrierId: string, formData: FormData) {
  const citiesRaw = formData.get('cities') as string;
  if (!citiesRaw) return; 
  
  const stateRaw = formData.get('state') as string;
  const state = stateRaw ? stateRaw.trim().toUpperCase() : '';

  if (!state) return;

  const cityList = citiesRaw.split(',').map(c => {
    const trimmed = c.trim().toLowerCase();
    if (!trimmed) return '';
    return trimmed.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }).filter(Boolean);

  const validLocations = await prisma.location.findMany({
    where: { city: { in: cityList }, state: state }
  });
  
  const validZips = validLocations.map(l => l.zip);

  if (validZips.length > 0) {
    await prisma.coverage.deleteMany({
      where: { 
        carrierId: carrierId,
        zip: { in: validZips }
      }
    });
  }
  
  revalidatePath(`/admin/carriers/${carrierId}`);
}

export async function createNewCarrier(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  // Handle edge case if slug exists
  let finalSlug = slug;
  let counter = 1;
  while (true) {
    const existing = await prisma.carrier.findUnique({ where: { slug: finalSlug } });
    if (!existing) break;
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const newCarrier = await prisma.carrier.create({
    data: { name, slug: finalSlug }
  });
  
  revalidatePath('/admin');
  redirect(`/admin/carriers/${newCarrier.id}`);
}
export async function deleteCarrier(id: string) {
  // 1. Delete all associated plans
  await prisma.plan.deleteMany({ where: { carrierId: id } });
  
  // 2. Delete all geographic coverage mappings
  await prisma.coverage.deleteMany({ where: { carrierId: id } });
  
  // 3. Delete the carrier itself
  await prisma.carrier.delete({ where: { id } });
  
  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}
export async function toggleTopPick(id: string, newStatus: boolean) {
  // Optional: If you only want ONE top pick globally, you can unset all others first
  // await prisma.carrier.updateMany({ data: { isTopPick: false } });
  
  await prisma.carrier.update({
    where: { id },
    data: { isTopPick: newStatus }
  });
  revalidatePath('/admin');
  revalidatePath('/');
}
export async function updatePlan(planId: string, carrierId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const postPromoPriceStr = formData.get('postPromoPrice') as string;
  const peakLatencyStr = formData.get('peakLatency') as string;
  const dataCap = formData.get('dataCap') as string;
  let fccLabelPath = undefined;
  const fccLabel = formData.get('fccLabel') as File | null;
  if (fccLabel && fccLabel.size > 0) {
    const buffer = Buffer.from(await fccLabel.arrayBuffer());
    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `fcc-${Date.now()}-${safeName}`;
    const filepath = path.join(process.cwd(), 'public', 'labels', filename);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    fccLabelPath = `/labels/${filename}`;
  }
  const postPromoPrice = postPromoPriceStr ? parseFloat(postPromoPriceStr) : null;
  const peakLatency = peakLatencyStr ? parseInt(peakLatencyStr) : null;
  const downloadSpeed = parseInt(formData.get('downloadSpeed') as string);
  const uploadSpeed = parseInt(formData.get('uploadSpeed') as string);
  const description = formData.get('description') as string;

  await prisma.plan.update({
    where: { id: planId },
    data: { name, price, postPromoPrice, peakLatency, dataCap, downloadSpeed, uploadSpeed, description, ...(fccLabelPath && { fccLabelImage: fccLabelPath }) }
  });
  
  revalidatePath('/admin/carriers/' + carrierId);
  revalidatePath('/');
}
