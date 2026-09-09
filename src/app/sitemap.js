export default function sitemap() {
  const baseUrl = 'https://onidetattoo.com';
  const routes = [
    '',
    '/portfolio',
    '/portfolio/black-and-grey',
    '/portfolio/realism',
    '/portfolio/bio-organic',
    '/aftercare',
    '/faq',
    '/book',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}