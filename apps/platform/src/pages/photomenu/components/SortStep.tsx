import { type Dispatch, type SetStateAction } from "react";
import SortableImages from "../SortableImages";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

interface SortStepProps {
    images: UploadedImage[];
    onImagesChange: Dispatch<SetStateAction<UploadedImage[]>>;
}

export default function SortStep({ images, onImagesChange }: SortStepProps) {
    return (
        <div>
            <SortableImages images={images} setImages={onImagesChange} />
        </div>
    );
}