import { Building2 } from "lucide-react";

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
}

export default function SetupStep({
    restaurantName,
    onRestaurantNameChange,
    selectedChain,
    onChainChange,
    chains,
}: SetupStepProps) {
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
                        className="w-full px-3 py-3 text-lg border rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                </div>

                {/* Chain Selection */}
                {chains && chains.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Restaurant Chain (Optional)
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                                <input
                                    type="radio"
                                    id="no-chain"
                                    name="chain"
                                    checked={selectedChain === null}
                                    onChange={() => onChainChange(null)}
                                    className="h-4 w-4 text-gray-600"
                                />
                                <label htmlFor="no-chain" className="flex-1 text-sm font-medium text-gray-700">
                                    Individual restaurant (not part of a chain)
                                </label>
                            </div>
                            
                            {chains.map((chain) => (
                                <div key={chain.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                                    <input
                                        type="radio"
                                        id={`chain-${chain.id}`}
                                        name="chain"
                                        checked={selectedChain === chain.id}
                                        onChange={() => onChainChange(chain.id)}
                                        className="h-4 w-4 text-gray-600"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor={`chain-${chain.id}`} className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                                            <Building2 className="w-4 h-4 text-gray-600" />
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