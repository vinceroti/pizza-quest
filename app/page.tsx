import LoginForm from '@/components/LoginForm';
import { sessionRedirect } from '~/actions';
export default async function LoginPage() {
	await sessionRedirect();
	return <LoginForm />;
}
