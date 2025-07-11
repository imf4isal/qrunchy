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
    selectedChain: number | null;
    onQrGenerated: (restaurantId: number) => void;
}

export default function GenerateStep({ 
    images, 
    restaurantId, 
    restaurantName, 
    selectedChain,
    onQrGenerated 
}: GenerateStepProps) {
    return (
        <div>
            <QRCodeGenerator 
                images={images} 
                restaurantId={restaurantId}
                restaurantName={restaurantName}
                selectedChain={selectedChain}
                onQrGenerated={onQrGenerated} 
            />
        </div>
    );
}
