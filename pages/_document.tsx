import {
	documentGetInitialProps,
	DocumentHeadTags,
	DocumentHeadTagsProps,
} from '@mui/material-nextjs/v14-pagesRouter';
import {
	DocumentContext,
	DocumentProps,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';
import * as React from 'react';

export default function MyDocument(
	props: DocumentProps & DocumentHeadTagsProps,
) {
	return (
		<Html lang="en">
			<Head>
				{/* PWA primary color */}
				<link rel="shortcut icon" href="/favicon.ico" />
				<meta name="emotion-insertion-point" content="" />
				<DocumentHeadTags {...props} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
	const finalProps = await documentGetInitialProps(ctx);
	return finalProps;
};
