import { getPortfolioImages } from '../../../lib/getPortfolioImages';
import PortfolioGallery from '../../../components/PortfolioGallery';

export const metadata = {
  title: 'Bio-Organic Tattoos | Onide Tattoo — Edmonton, AB',
  description: 'Bio-Organic tattoo portfolio by Onide, tattoo artist in Edmonton, Alberta.',
};

export default function BioOrganicPage() {
  const images = getPortfolioImages('bio-organic');
  return <PortfolioGallery title="Bio-Organic" images={images} />;
}