interface SetupStepProps {
    restaurantName: string;
    onRestaurantNameChange: (name: string) => void;
}

export default function SetupStep({
                                      restaurantName,
                                      onRestaurantNameChange,
                                  }: SetupStepProps) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Restaurant Information</h2>
            <p className="text-gray-600 mb-6">
                Start by entering your restaurant's basic information
            </p>

            <div className="space-y-4">
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
                        placeholder="Enter your restaurant name"
                        value={restaurantName}
                        onChange={(e) => onRestaurantNameChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}