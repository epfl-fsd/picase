import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'PiCase',
	description: 'A simple case management system',
	icons: {
		icon: [
			{
				url: 'https://epfl-si.github.io/elements/svg/epfl-logo.svg',
			},
		],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html>
			<body className={cn('antialiased h-screen bg-background p-8', inter.className)}>{children}</body>
		</html>
	);
}
