import { getServerSession } from 'next-auth/next';

import { authOptions } from '~/api/auth/[...nextauth]/route';

export default async function Dashboard() {
	const session = await getServerSession(authOptions);
	console.log(session);
	if (session) {
		return <p>Signed in as {session.user?.username}</p>;
	}

	return <a href="/signin">Sign in</a>;
}
