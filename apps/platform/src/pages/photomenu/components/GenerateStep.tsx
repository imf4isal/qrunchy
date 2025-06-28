import QRCodeGenerator from "../QRCodeGenerator";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

interface GenerateStepProps {
    images: UploadedImage[];
    onQrGenerated: () => void;
}

export default function GenerateStep({ images, onQrGenerated }: GenerateStepProps) {
    return (
        <div>
            <QRCodeGenerator images={images} onQrGenerated={onQrGenerated} />
        </div>
    );
}
