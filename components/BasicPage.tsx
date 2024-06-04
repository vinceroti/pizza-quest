import Header from '@/components/Header';

export default function LoginPage({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<main className="flex grow flex-col items-center justify-between">
				{children}
			</main>
		</>
	);
}
