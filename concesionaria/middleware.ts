import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Si no hay variables de entorno, permitir acceso
    if (!supabaseUrl || !supabaseAnonKey) {
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    // Refrescar la sesión
    const { data: { session } } = await supabase.auth.getSession();

    // Portero: Proteger rutas del dashboard
    // Si el usuario intenta acceder a /jv-secure-access-v1/dashboard y no tiene sesión, redirigir al login
    if (request.nextUrl.pathname.startsWith('/jv-secure-access-v1/dashboard') && !session) {
        return NextResponse.redirect(new URL('/jv-secure-access-v1', request.url));
    }

    return response;
}

export const config = {
    matcher: ['/jv-secure-access-v1/dashboard/:path*'],
};
