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
    selectedTheme: "minimal" | "modern";
    selectedChain: number | null;
    onQrGenerated: (restaurantId: number) => void;
}

export default function GenerateStep({ 
    images, 
    restaurantId, 
    restaurantName, 
    selectedTheme,
    selectedChain,
    onQrGenerated 
}: GenerateStepProps) {
    return (
        <div>
            <QRCodeGenerator 
                images={images} 
                restaurantId={restaurantId}
                restaurantName={restaurantName}
                selectedTheme={selectedTheme}
                selectedChain={selectedChain}
                onQrGenerated={onQrGenerated} 
            />
        </div>
    );
}
