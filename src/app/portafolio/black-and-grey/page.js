import { getPortfolioImages } from '@/lib/getPortfolioImages';
import PortfolioGallery from '@/components/PortfolioGallery';

export const metadata = {
  title: 'Black & Grey Tattoos | Onide Tattoo — Edmonton, AB',
  description: 'Black and grey tattoo portfolio by Onide, tattoo artist in Edmonton, Alberta.',
};

export default function BlackAndGreyPage() {
  const images = getPortfolioImages('black-and-grey');
  return <PortfolioGallery title="Black & Grey" images={images} />;
}


