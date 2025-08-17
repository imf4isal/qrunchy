import { Building2, Upload, X } from "lucide-react";
import { useState } from "react";

interface Chain {
  id: number;
  name: string;
  description?: string;
}

interface SetupStepProps {
    restaurantName: string;
    onRestaurantNameChange: (name: string) => void;
    selectedChain: number | null;
    onChainChange: (chainId: number | null) => void;
    chains?: Chain[];
    restaurantImage?: File | null;
    onRestaurantImageChange: (image: File | null) => void;
}

export default function SetupStep({
    restaurantName,
    onRestaurantNameChange,
    selectedChain,
    onChainChange,
    chains,
    restaurantImage,
    onRestaurantImageChange,
}: SetupStepProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                onRestaurantImageChange(file);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                onRestaurantImageChange(file);
            }
        }
    };
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Restaurant Information</h2>
            <p className="text-gray-600 mb-6">
                Start by entering your restaurant's basic information for your photo menu
            </p>

            <div className="space-y-6">
                {/* Restaurant Name */}
                <div>
                    <label
                        htmlFor="restaurantName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Restaurant Name *
                    </label>
                    <input
                        id="restaurantName"
                        type="text"
                        placeholder="e.g. Mario's Pizza, Sunset Cafe, The Local Bistro"
                        value={restaurantName}
                        onChange={(e) => onRestaurantNameChange(e.target.value)}
                        className="w-full px-3 py-3 text-lg border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Restaurant Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Image (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        Upload a logo or image that represents your restaurant. This will be displayed on your menu.
                    </p>
                    
                    {!restaurantImage ? (
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                        >
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                                Drag and drop an image here, or click to select
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="restaurant-image-upload"
                            />
                            <label
                                htmlFor="restaurant-image-upload"
                                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                                Choose Image
                            </label>
                        </div>
                    ) : (
                        <div className="relative inline-block">
                            <img
                                src={URL.createObjectURL(restaurantImage)}
                                alt="Restaurant"
                                className="w-32 h-32 object-cover rounded-lg border"
                            />
                            <button
                                onClick={() => onRestaurantImageChange(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Chain Selection */}
                {chains && chains.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Restaurant Chain (Optional)
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-300 transition-colors">
                                <input
                                    type="radio"
                                    id="no-chain"
                                    name="chain"
                                    checked={selectedChain === null}
                                    onChange={() => onChainChange(null)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="no-chain" className="flex-1 text-sm font-medium text-gray-700">
                                    Individual restaurant (not part of a chain)
                                </label>
                            </div>
                            
                            {chains.map((chain) => (
                                <div key={chain.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-300 transition-colors">
                                    <input
                                        type="radio"
                                        id={`chain-${chain.id}`}
                                        name="chain"
                                        checked={selectedChain === chain.id}
                                        onChange={() => onChainChange(chain.id)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor={`chain-${chain.id}`} className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                                            <Building2 className="w-4 h-4 text-blue-600" />
                                            <span>{chain.name}</span>
                                        </label>
                                        {chain.description && (
                                            <p className="text-xs text-gray-500 mt-1 ml-6">{chain.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Select a chain to group this restaurant with your other locations for better organization.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}