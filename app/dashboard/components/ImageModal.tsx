import { Box, Modal } from '@mui/material';
import Image from 'next/image';

type ImageModalProps = {
	open: boolean;
	imageUrl: string | null;
	onClose: () => void;
};

export default function ImageModal({
	open,
	imageUrl,
	onClose,
}: ImageModalProps) {
	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-label="Full size pizza image"
		>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: { xs: '95vw', sm: '80vw', md: '60vw' },
					height: { xs: '60vh', sm: '70vh', md: '80vh' },
					maxWidth: '1200px',
					maxHeight: '1200px',
					bgcolor: 'rgba(30, 58, 95, 0.95)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(77, 144, 254, 0.2)',
					boxShadow: 24,
					p: 2,
					color: 'text.primary',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
				}}
			>
				{imageUrl && (
					<Image
						src={imageUrl}
						alt="Full size pizza image"
						width={1200}
						height={1200}
						style={{
							width: 'auto',
							height: '100%',
							maxWidth: '100%',
							maxHeight: '100%',
							objectFit: 'contain',
						}}
						priority
					/>
				)}
			</Box>
		</Modal>
	);
}
