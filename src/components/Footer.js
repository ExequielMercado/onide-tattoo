export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Onide Tattoo — Edmonton, AB
        </p>
        <div className="flex gap-6 text-sm">
          <a href="https://instagram.com/TU_USUARIO" target="_blank" className="hover:text-gray-400">
            Instagram
          </a>
          <a href="mailto:contacto@onidetattoo.com" className="hover:text-gray-400">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}