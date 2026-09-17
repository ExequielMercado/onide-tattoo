const whatsappUrl =
  'https://wa.me/15875669583?text=Hey%21%20I%27m%20interested%20in%20getting%20a%20tattoo.';

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Onide Tattoo on WhatsApp"
      title="Message Onide on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8 fill-current"
      >
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.1.55 4.15 1.6 5.96L.1 24l6.3-1.65a11.87 11.87 0 0 0 5.68 1.45h.01c6.54 0 11.87-5.33 11.87-11.88 0-3.18-1.24-6.16-3.44-8.44Zm-8.44 18.3h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.87 9.87 0 0 1-1.51-5.27C2.2 6.44 6.63 2 12.08 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.9 7.02c0 5.45-4.43 9.86-9.89 9.86Zm5.41-7.39c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47a8.88 8.88 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
