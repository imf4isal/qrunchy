import SortableImages from "../SortableImages";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

interface SortStepProps {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
}

export default function SortStep({ images, onImagesChange }: SortStepProps) {
    return (
        <div>
            <SortableImages images={images} setImages={onImagesChange} />
        </div>
    );
}
