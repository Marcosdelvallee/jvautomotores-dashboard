import Image from 'next/image';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900">
            <div className="relative w-64 h-64 mb-8 animate-pulse">
                <Image
                    src="/logo-loading.png"
                    alt="Cargando..."
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium tracking-widest uppercase animate-pulse">
                    Cargando
                </p>
            </div>
        </div>
    );
}
