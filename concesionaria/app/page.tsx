import { getCars } from '@/lib/data';
import { Hero } from '@/app/components/Hero';
import { Catalog } from '@/app/components/Catalog';
import { Header } from '@/app/components/Header';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export default async function Home() {
  const cars = await getCars();

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <Catalog initialCars={cars} />

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img
              src="/logo-final.png"
              alt="JV Automotores"
              className="h-16 md:h-25 w-auto object-contain opacity-80 hover:opacity-100 transition-all"
            />

          </div>
          <div className="text-center md:text-right">
            <p>© {new Date().getFullYear()} JVautomotores. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
