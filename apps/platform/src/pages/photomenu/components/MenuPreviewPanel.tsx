import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import PhotoMenuPreview from "@/pages/photomenu/PhotoMenuPreview.tsx";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

interface MenuPreviewPanelProps {
    images: UploadedImage[];
    restaurantName: string;
}

export default function MenuPreviewPanel({
                                             images,
                                             restaurantName,
                                         }: MenuPreviewPanelProps) {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Menu Preview</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="lg:hidden"
                    >
                        <Eye size={16} />
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    How customers will see your menu
                </p>
            </div>
            <div
                className={`p-4 ${showPreview ? "block" : "hidden lg:block"}`}
            >
                <PhotoMenuPreview
                    images={images}
                    restaurantName={restaurantName || "Your Restaurant"}
                />
            </div>
        </div>
    );
}