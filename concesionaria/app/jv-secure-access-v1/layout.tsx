import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JV Admin | Panel de Control",
    description: "Panel de administración para JV Automotores",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "JV Admin",
    },
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
