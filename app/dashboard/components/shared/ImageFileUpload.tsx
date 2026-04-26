import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface FileUploadProps {
	file: File | null;
	setFile: (file: File | null) => void;
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	alt: string;
	className?: string;
	imageClassName?: string;
	onlyCornerButton?: boolean;
	veryRoundedImage?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
	file,
	setFile,
	handleFileChange,
	className,
	alt,
	onlyCornerButton,
	imageClassName,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		}
		setPreviewUrl(null);
	}, [file]);

	return (
		<div className={className}>
			<div className="mb-3 flex justify-center">
				<div className="image-upload-container m-auto relative flex">
					{file && previewUrl && (
						<>
							<Image
								src={previewUrl}
								alt={alt}
								width={208}
								height={117}
								className={`rounded-lg ${imageClassName}`}
							/>
							<button
								className="delete-image-button absolute top-0 right-0 bg-black bg-opacity-50 button-link p-2.5 rounded-bl-lg rounded-tr-lg flex items-center justify-center hover:bg-opacity-70 ease-in-out transition"
								onClick={() => setFile(null)}
								aria-label="Remove image"
								type="button"
							>
								<FontAwesomeIcon icon="xmark" />
							</button>
						</>
					)}
				</div>
			</div>
			{(!onlyCornerButton || !file) && (
				<>
					<input
						accept="image/jpeg,image/png,image/webp,image/gif"
						id="contained-button-file"
						type="file"
						className="hidden"
						onChange={handleFileChange}
					/>
					<label htmlFor="contained-button-file">
						<Button variant="contained" component="span" fullWidth>
							<FontAwesomeIcon icon="image" className="mr-1" />
							{file ? file.name : 'Upload Image'}
						</Button>
					</label>
				</>
			)}
		</div>
	);
};

export default FileUpload;
