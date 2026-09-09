import fs from 'fs';
import path from 'path';

export function getPortfolioImages(styleSlug) {
  const dir = path.join(process.cwd(), 'public', 'images', 'portfolio', styleSlug);
  const filenames = fs.readdirSync(dir);

  return filenames
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map((file) => `/images/portfolio/${styleSlug}/${file}`);
}