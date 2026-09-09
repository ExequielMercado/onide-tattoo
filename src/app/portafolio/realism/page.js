import { getPortfolioImages } from '../../../lib/getPortfolioImages';
import PortfolioGallery from '../../../components/PortfolioGallery';

export const metadata = {
  title: 'Realism Tattoos | Onide Tattoo — Edmonton, AB',
  description: 'Realism tattoo portfolio by Onide, tattoo artist in Edmonton, Alberta.',
};

export default function RealismPage() {
  const images = getPortfolioImages('realism');
  return <PortfolioGallery title="Realism" images={images} />;
}