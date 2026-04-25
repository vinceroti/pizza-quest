import BasicPage from '@/components/BasicPage';
import { sessionRedirect } from '~/actions';

import SignUp from './SignUp';
export default async function SignupPage() {
	await sessionRedirect();
	return (
		<BasicPage>
			<SignUp />
		</BasicPage>
	);
}
