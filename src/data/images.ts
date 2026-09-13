import type { ImageAsset } from './types';

/*
 * Registre central des images.
 * Toutes les images sont des assets locaux sous src/assets/images/,
 * resolus par le pipeline d'assets Astro via import.meta.glob.
 */

const assetUrls = import.meta.glob('../assets/images/**/*.webp', {
  eager: true,
}) as Record<string, { default: { src: string } }>;

const local = (rel: string): string =>
  assetUrls[`../assets/images/${rel}`]?.default?.src ?? '';

export const images = {
  hero_coaching: { src: local('hero/surf-coaching.webp'), alt: 'A surf coach giving instructions to a student on the beach in Taghazout.', hint: 'surf coaching' },
  hero_guiding: { src: local('hero/surf-guiding.webp'), alt: 'A group of surfers being guided to a remote surf spot in Morocco.', hint: 'surf guiding' },
  hero_yoga: { src: local('hero/surf-yoga.webp'), alt: 'A woman in a yoga pose on a rooftop overlooking the ocean in Taghazout.', hint: 'surf yoga' },
  package1: { src: local('hero/surf-coaching.webp'), alt: 'A surf coach giving instructions to students on the beach in Taghazout.', hint: 'surf coaching' },
  package2: { src: local('surf/surf-barrel.webp'), alt: 'A surfer getting barreled inside a clean wave in Taghazout', hint: 'surfer barrel' },
  package3: { src: local('hero/surf-yoga.webp'), alt: 'A group of people doing yoga on a wooden deck overlooking the ocean at sunrise', hint: 'beach yoga' },
  package_digital_nomad: { src: local('surf/surf-digital-nomad.webp'), alt: 'A person working on a laptop in a comfortable common area with surfboards in the background.', hint: 'surf work' },
  package_couples: { src: local('surf/surf-couple.webp'), alt: 'A couple smiling and holding surfboards on the beach.', hint: 'couple surfing' },
  package_group: { src: local('hero/surf-guiding.webp'), alt: 'A group of surfers posing with their boards on the beach.', hint: 'group surfing' },
  imsouane_bay: { src: local('activities/activity-imsouane.webp'), alt: 'The long wave of Imsouane bay in Morocco with longboarders', hint: 'imsouane morocco' },
  paradise_valley: { src: local('activities/activity-paradise-valley.webp'), alt: 'Natural rock pools and palm trees in Paradise Valley, Morocco', hint: 'paradise valley' },
  sand_dunes: { src: local('activities/activity-sandboarding.webp'), alt: 'Person sandboarding down a large sand dune next to the ocean', hint: 'sand dunes' },
  food_tagine: { src: local('restaurant/restaurant-tagine.webp'), alt: 'Traditional Moroccan tagine served at the surf camp', hint: 'moroccan food' },
  food_salad_fresh: { src: local('restaurant/restaurant-salad.webp'), alt: 'A fresh and colorful salad in a bowl.', hint: 'fresh salad' },
  food_bbq: { src: local('restaurant/restaurant-bbq.webp'), alt: 'Grilled fish on a barbecue.', hint: 'fish bbq' },
  food_rooftop_dining: { src: local('restaurant/restaurant-bbq.webp'), alt: 'Dining area on the rooftop terrace overlooking the ocean.', hint: 'rooftop dining' },
  food_chef: { src: local('restaurant/restaurant-chef.webp'), alt: 'A chef preparing a meal in a Moroccan kitchen.', hint: 'moroccan chef' },
  shop_tee: { src: local('shop/surf-shop.webp'), alt: 'A stylish t-shirt with a surf-themed design.', hint: 'surf tshirt' },
  shop_leash: { src: local('shop/surf-shop.webp'), alt: 'A surfboard leash.', hint: 'surfboard leash' },
  surf_shop_hero: { src: local('shop/surf-shop.webp'), alt: 'The exterior of the Mouja Taghazout surf shop in Taghazout.', hint: 'surf shop' },
  accommodation_dorm_1: { src: local('accommodation/accommodation-dorm.webp'), alt: 'Dorm room with bunk beds', hint: 'dorm room' },
  accommodation_twin_1: { src: local('accommodation/accommodation-twin.webp'), alt: 'Twin room with shared bathroom', hint: 'twin room' },
  accommodation_private: { src: local('accommodation/accommodation-private.webp'), alt: 'A cozy private double room with a comfortable bed.', hint: 'private room' },
  private_double_balcony: { src: local('accommodation/accommodation-private-balcony.webp'), alt: 'A private double room with an ensuite bathroom and a balcony.', hint: 'private room balcony' },
  deluxe_private_1: { src: local('accommodation/accommodation-deluxe.webp'), alt: 'A luxury hotel room with a balcony and an ocean view', hint: 'ocean view' },
  accommodation_studio: { src: local('accommodation/accommodation-studio.webp'), alt: 'A cozy studio apartment with a combined living and sleeping area.', hint: 'studio apartment' },
  accommodation_apartment: { src: local('accommodation/accommodation-apartment.webp'), alt: 'A modern apartment interior with a kitchenette and living area with an ocean view.', hint: 'apartment ocean view' },
  accommodation_main_lounge: { src: local('accommodation/accommodation-lounge.webp'), alt: 'Main lounge and social area for guests at Mouja Taghazout surf camp.', hint: 'surf lounge' },
  blog_post_1: { src: local('surf/surf-barrel.webp'), alt: 'A surfer riding a long, clean wave at sunset in Taghazout.', hint: 'surfer taghazout' },
  blog_post_2: { src: local('blog/blog-first-surf-lesson.webp'), alt: 'A beginner surfer smiling after catching their first small wave.', hint: 'beginner surfer' },
} satisfies Record<string, ImageAsset>;

export type ImageId = keyof typeof images;

export function getImage(id: ImageId): ImageAsset {
  return images[id];
}