import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Modal } from '@mui/material';
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
				borderRadius: '16px',
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
				<IconButton
					onClick={onClose}
					aria-label="Close image"
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						width: 44,
						height: 44,
						color: 'rgba(255,255,255,0.85)',
						bgcolor: 'rgba(0,0,0,0.4)',
						'&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
					}}
				>
					<FontAwesomeIcon icon="xmark" />
				</IconButton>
				{imageUrl && (
					<Image
						src={imageUrl}
						alt="Full size pizza image"
						width={1200}
						height={1200}
						className="image-modal__image"
						priority
					/>
				)}
			</Box>
		</Modal>
	);
}
