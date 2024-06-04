import BasicPage from '@/components/BasicPage';
import LoginForm from '@/components/LoginForm';
import { sessionRedirect } from '~/actions';
export default async function LoginPage() {
	await sessionRedirect();
	return (
		<BasicPage>
			<LoginForm />
		</BasicPage>
	);
}
