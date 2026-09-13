import { SITE } from '../../data/loaders';

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export interface GraphNode {
  [key: string]: unknown;
}

export const organizationNode = (): GraphNode => ({
  '@type': 'LocalBusiness',
  '@id': ORG_ID,
  name: SITE.businessName,
  alternateName: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  description: SITE.tagline,
  address: { '@type': 'PostalAddress', ...SITE.addressObject },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  },
  priceRange: SITE.priceRange,
  currenciesAccepted: SITE.currenciesAccepted,
  areaServed: SITE.areaServed.map((name) => ({ '@type': 'City', name })),
  sameAs: [...SITE.sameAs],
});

export const websiteNode = (): GraphNode => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE.url,
  name: SITE.businessName,
  description: SITE.tagline,
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
});

export const webPageNode = (opts: {
  url: string;
  name: string;
  description: string;
  mainEntity?: string;
}): GraphNode => ({
  '@type': 'WebPage',
  '@id': `${opts.url}#webpage`,
  url: opts.url,
  name: opts.name,
  description: opts.description,
  isPartOf: { '@id': WEBSITE_ID },
  publisher: { '@id': ORG_ID },
  ...(opts.mainEntity
    ? { mainEntity: { '@id': opts.mainEntity }, about: { '@id': opts.mainEntity } }
    : {}),
});

export const breadcrumbListNode = (
  pageUrl: string,
  items: { name: string; url: string }[],
): GraphNode => ({
  '@type': 'BreadcrumbList',
  '@id': `${pageUrl}#breadcrumb`,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

export const serviceNode = (opts: {
  id: string;
  name: string;
  description: string;
  url: string;
  serviceType: string;
}): GraphNode => ({
  '@type': 'Service',
  '@id': opts.id,
  name: opts.name,
  description: opts.description,
  url: opts.url,
  serviceType: opts.serviceType,
  provider: { '@id': ORG_ID },
});

export const offerNode = (opts: {
  id: string;
  name: string;
  url: string;
  price: number;
  itemOfferedId: string;
}): GraphNode => ({
  '@type': 'Offer',
  '@id': opts.id,
  name: opts.name,
  url: opts.url,
  price: String(opts.price),
  priceCurrency: SITE.currenciesAccepted,
  seller: { '@id': ORG_ID },
  itemOffered: { '@id': opts.itemOfferedId },
});

export const faqPageNode = (id: string, faqs: { q: string; a: string }[]): GraphNode => ({
  '@type': 'FAQPage',
  '@id': id,
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const articleNode = (opts: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  author: string;
  image: string;
}): GraphNode => ({
  '@type': 'Article',
  '@id': `${opts.url}#article`,
  headline: opts.headline,
  description: opts.description,
  datePublished: opts.datePublished,
  image: opts.image,
  author: { '@type': 'Person', name: opts.author },
  publisher: { '@id': ORG_ID },
  mainEntityOfPage: { '@id': `${opts.url}#webpage` },
  isPartOf: { '@id': WEBSITE_ID },
});