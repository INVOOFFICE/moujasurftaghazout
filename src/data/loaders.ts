import type { ImageAsset } from './types';
import { images } from './images';

export interface Highlight {
  label: string;
  value: string;
  icon: string;
}

export interface PackageFaq {
  q: string;
  a: string;
}

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface SurfPackage {
  id: string;
  name: string;
  shortName: string;
  description: string;
  price: string;
  basePrice: number;
  duration: string;
  durationWeeks: number;
  features: string[];
  imageId: string;
  popular?: boolean;
  isForTwo?: boolean;
  colorClass?: string;
  highlights: Highlight[];
  schedule: ScheduleItem[];
  faqs: PackageFaq[];
}

export interface Room {
  id: string;
  name: string;
  subtitle: string;
  features: string[];
  upgradePrice: number;
  imageId: string;
  icon: string;
}

export interface Activity {
  slug: string;
  title: string;
  shortName: string;
  description: string;
  imageId: string;
  inclusions: { icon: string; text: string }[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  items?: 'packages' | 'activities';
}

export interface MegaMenuItem {
  type: 'dropdown' | 'link';
  label: string;
  href?: string;
  items?: {
    title?: string;
    href?: string;
    imageId?: string;
    isSeparator?: boolean;
  }[];
}

interface Content {
  rooms: Room[];
  packages: SurfPackage[];
  activities: Activity[];
  restaurant: {
    title: string;
    subtitle: string;
    description: string;
    philosophy: string;
    menuHighlights: { name: string; description: string; imageId: string }[];
    galleryIds: string[];
  };
  shop: {
    title: string;
    subtitle: string;
    description: string;
    offerings: { title: string; description: string; icon: string }[];
    products: { name: string; price: string; imageId: string }[];
  };
  hero: {
    title: string;
    description: string;
    price: string;
    buttonLabel: string;
    buttonLink: string;
    imageId: string;
  }[];
  nav: NavItem[];
  megamenu: MegaMenuItem[];
}

import json from './content.json';

const data: Content = json as Content;

export const nav = data.nav;
export const megamenu = data.megamenu;
export const socials: SocialLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/1C998bz4EK/?mibextid=wwXIfr' },
  { label: 'Instagram', href: 'https://www.instagram.com/taghazoutsurfnomads/' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/taghazoutsurfnomads/' },
  { label: 'WhatsApp', href: 'https://wa.me/48662763381' },
];

export const packages = data.packages;
export const rooms = data.rooms;
export const activities = data.activities;
export const restaurant = data.restaurant;
export const shop = data.shop;
export const heroOffers = data.hero;

export const getPackage = (slug: string) => packages.find((p) => p.id === slug);
export const getRoom = (id: string) => rooms.find((r) => r.id === id);
export const getActivity = (slug: string) => activities.find((a) => a.slug === slug);

export function image(id: string | undefined): ImageAsset {
  return (images as Record<string, ImageAsset>)[id ?? ''] ?? images.hero_coaching;
}

export const fallbackImage: ImageAsset = images.hero_coaching;

export const SITE = {
  name: 'MOUJA TAGHAZOUT',
  shortName: 'Mouja Taghazout',
  businessName: 'MOUJA SURF SCHOOL',
  tagline: 'Beach Front Surf & Yoga Camp in Taghazout, Morocco.',
  url: 'https://moujasurfschool.com',
  phone: '+48 662 763 381',
  whatsapp: 'https://wa.me/48662763381',
  email: 'taghazoutsurfnomads@gmail.com',
  address: 'Anchor Point, Taghazout, 80022, Agadir, Morocco',
  addressObject: {
    streetAddress: 'Anchor Point',
    addressLocality: 'Taghazout',
    postalCode: '80022',
    addressRegion: 'Agadir',
    addressCountry: 'MA',
  },
  geo: {
    latitude: 30.545596,
    longitude: -9.713522,
  },
  areaServed: ['Taghazout', 'Agadir'],
  priceRange: '€470 - €1020',
  currenciesAccepted: 'EUR',
  sameAs: [
    'https://www.instagram.com/taghazoutsurfnomads/',
    'https://www.facebook.com/share/1C998bz4EK/',
    'https://www.pinterest.com/taghazoutsurfnomads/',
  ],
  founder: 'Younes A.',
  copyright: '© 2024 MOUJA TAGHAZOUT. All rights reserved.',
  credit: 'Designed by @Gipy Younes',
} as const;