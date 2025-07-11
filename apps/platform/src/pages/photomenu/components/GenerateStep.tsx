import QRCodeGenerator from "../QRCodeGenerator";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

interface GenerateStepProps {
    images: UploadedImage[];
    restaurantId: number;
    restaurantName: string;
    onQrGenerated: () => void;
}

export default function GenerateStep({ images, restaurantId, restaurantName, onQrGenerated }: GenerateStepProps) {
    return (
        <div>
            <QRCodeGenerator 
                images={images} 
                restaurantId={restaurantId}
                restaurantName={restaurantName}
                onQrGenerated={onQrGenerated} 
            />
        </div>
    );
}
