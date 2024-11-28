import Profile from './Profile';
export default async function Page({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const username = (await params).username;
	return <Profile username={username} />;
}
