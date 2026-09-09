import BookingForm from '../../components/BookingForm';

export const metadata = {
  title: 'Book a Consultation | Onide Tattoo — Edmonton, AB',
  description: 'Book a tattoo consultation with Onide in Edmonton, Alberta.',
};

export default function BookPage() {
  return (
    <div className="pt-20 min-h-screen bg-black">
      <BookingForm />
    </div>
  );
}