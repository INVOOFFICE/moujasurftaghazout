import type { ImageAsset } from './types';
import { images } from './images';
import { csvRaw } from './accommodations.source';

/*
 * Accommodation catalogue — single authoritative source.
 *
 * The records are NOT duplicated here. They are parsed once, at build time,
 * from a generated snapshot of the client-supplied CSV:
 *
 *   MOUJA_accommodation_complet.csv   (kept local, not published)
 *     -> src/data/accommodations.source.ts   (committed, generated)
 *
 * The CSV stays the editable source of truth on the maintainer's machine but
 * is deliberately excluded from the repository. To refresh the published data
 * after editing the CSV, run `npm run data:accommodations` and rebuild.
 *
 * Data policy (see AGENTS.md): never invent business data. Rows whose
 * `rate_verified` flag is `false` are treated as provisional and are only
 * surfaced through the `ACCOMMODATION_PRICING` guard below.
 */

export interface Accommodation {
  id: string;
  name: string;
  zone: string;
  bedrooms: number;
  maxGuests: number;
  /** Whole-unit rate per night, original value from the CSV. */
  price: number;
  status: string;
  slug: string;
  type: string;
  currency: string;
  ratePeriod: string;
  rateVerified: boolean;
  description: string;
  bedConfiguration: string;
  bathrooms: string;
  amenities: string[];
  imageIds: string[];
  featuredImageId: string;
  displayOrder: number;
  featured: boolean;
  notesInternal: string;
  cardTitle: string;
  shortDescription: string;
  detailIntro: string;
  imageFallback: string;
  dataMode: string;
  completionStatus: string;
}

export interface ResolvedImage {
  src: string;
  alt: string;
}

/*
 * Pricing guard.
 *
 * Every rate in the current CSV is flagged `rate_verified = false`. While
 * `displayUnverifiedRates` is `true` the provisional amounts are shown with a
 * clear "to be confirmed" marker. Set it to `false` (or flip `rate_verified`
 * per row once confirmed) to hide unconfirmed amounts entirely and show the
 * neutral `onRequestLabel` instead, so a template amount can never become an
 * authoritative public offer.
 */
export const ACCOMMODATION_PRICING = {
  displayUnverifiedRates: true,
  provisionalLabel: 'Provisional rate — to be confirmed',
  provisionalShortLabel: 'To be confirmed',
  onRequestLabel: 'Price on request',
} as const;

/** RFC 4180-ish CSV parser: handles quoted fields, escaped quotes and CRLF. */
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function splitList(value: string): string[] {
  return value
    .split(/[;\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toInt(value: string): number {
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBool(value: string): boolean {
  return value.trim().toLowerCase() === 'true';
}

function buildAccommodations(): Accommodation[] {
  const table = parseCsv(csvRaw).filter((row) => row.some((cell) => cell.trim() !== ''));
  const [header, ...rows] = table;

  const index = new Map<string, number>();
  // Header cells may contain line breaks (e.g. "whole\napartment\nrate");
  // normalize them so the expected snake_case keys always resolve.
  const normalizeKey = (key: string): string =>
    key.trim().toLowerCase().replace(/[\s\r\n]+/g, '_');
  header.forEach((key, i) => index.set(normalizeKey(key), i));

  const cell = (row: string[], key: string): string => {
    const at = index.get(normalizeKey(key));
    return at === undefined ? '' : (row[at] ?? '');
  };

  return rows
    .map((row) => ({
      id: cell(row, 'id'),
      name: cell(row, 'name'),
      zone: cell(row, 'zone'),
      bedrooms: toInt(cell(row, 'bedrooms')),
      maxGuests: toInt(cell(row, 'max_guests')),
      price: toInt(cell(row, 'whole_apartment_rate')),
      status: cell(row, 'status'),
      slug: cell(row, 'slug'),
      type: cell(row, 'accommodation_type'),
      currency: cell(row, 'currency'),
      ratePeriod: cell(row, 'rate_period'),
      rateVerified: toBool(cell(row, 'rate_verified')),
      description: cell(row, 'description'),
      bedConfiguration: cell(row, 'bed_configuration'),
      bathrooms: cell(row, 'bathrooms'),
      amenities: splitList(cell(row, 'amenities')),
      imageIds: splitList(cell(row, 'image_ids')),
      featuredImageId: cell(row, 'featured_image_id'),
      displayOrder: toInt(cell(row, 'display_order')),
      featured: toBool(cell(row, 'featured')),
      notesInternal: cell(row, 'notes_internal'),
      cardTitle: cell(row, 'template_card_title'),
      shortDescription: cell(row, 'template_short_description'),
      detailIntro: cell(row, 'template_detail_intro'),
      imageFallback: cell(row, 'template_image_fallback'),
      dataMode: cell(row, 'template_data_mode'),
      completionStatus: cell(row, 'content_completion_status'),
    }))
    .filter((row) => row.id !== '')
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export const accommodations: Accommodation[] = buildAccommodations();

/** Only stays flagged `Active` in the CSV are published on the page. */
export const activeAccommodations: Accommodation[] = accommodations.filter(
  (stay) => stay.status.toLowerCase() === 'active',
);

export const getAccommodation = (id: string): Accommodation | undefined =>
  accommodations.find((stay) => stay.id === id);

/** True only when the CSV explicitly marks the rate as verified. */
export const isRateVerified = (stay: Accommodation): boolean => stay.rateVerified;

/** Whether an amount may be rendered at all, honouring the pricing guard. */
export const canDisplayRate = (stay: Accommodation): boolean =>
  stay.rateVerified || ACCOMMODATION_PRICING.displayUnverifiedRates;

/** Human label for a stay, falling back to the provisional template title. */
export const accommodationTitle = (stay: Accommodation): string =>
  stay.name || stay.cardTitle;

/** Description used on cards: verified copy wins over the template copy. */
export const accommodationSummary = (stay: Accommodation): string =>
  stay.description || stay.shortDescription;

/** Longer intro used in the details view. */
export const accommodationIntro = (stay: Accommodation): string =>
  stay.description || stay.detailIntro || stay.shortDescription;

/**
 * Resolve property photographs strictly against the local image registry.
 * Unlike `image()` there is deliberately NO fallback here: an unknown id is
 * dropped rather than replaced by an unrelated surf/hotel photograph.
 */
export const accommodationImages = (stay: Accommodation): ResolvedImage[] => {
  const registry = images as Record<string, ImageAsset>;
  const ids = [stay.featuredImageId, ...stay.imageIds].filter(Boolean);
  const seen = new Set<string>();

  return ids
    .filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((id) => registry[id])
    .filter((asset): asset is ImageAsset => Boolean(asset?.src))
    .map((asset) => ({ src: asset.src, alt: asset.alt }));
};
