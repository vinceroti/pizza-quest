import BasicPage from '@/components/BasicPage';
import { sessionRedirect } from '~/actions';

import SignUp from './SignUp';
export default async function LoginPage() {
	await sessionRedirect();
	return (
		<BasicPage>
			<SignUp />
		</BasicPage>
	);
}
