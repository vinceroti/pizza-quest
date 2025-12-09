import { Suspense } from 'react';

import BasicPage from '@/components/BasicPage';

import ResetPassword from './ResetPassword';

export default function ResetPasswordPage() {
	return (
		<BasicPage>
			<Suspense fallback={<div>Loading...</div>}>
				<ResetPassword />
			</Suspense>
		</BasicPage>
	);
}
