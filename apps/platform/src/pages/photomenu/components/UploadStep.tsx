import ImageUploader from "../ImageUploader";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

interface UploadStepProps {
    images: UploadedImage[];
    onImagesAdded: (images: UploadedImage[]) => void;
    onImageRemoved: (id: string) => void;
}

export default function UploadStep({
                                       images,
                                       onImagesAdded,
                                       onImageRemoved,
                                   }: UploadStepProps) {
    return (
        <div>
            <ImageUploader
                onImagesAdded={onImagesAdded}
                onImageRemoved={onImageRemoved}
                existingImages={images}
            />
        </div>
    );
}