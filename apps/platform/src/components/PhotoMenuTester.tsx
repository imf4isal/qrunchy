import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSamplePhotoMenus, getTestPhotoMenuQR } from "@/data/dummyPhotoMenu";
import { getAllPhotoMenus, deletePhotoMenu } from "@/utils/photoMenuStorage";

export default function PhotoMenuTester() {
  const [photoMenus, setPhotoMenus] = useState(getAllPhotoMenus());

  const handleCreateSamples = () => {
    const qrCodes = createSamplePhotoMenus();
    setPhotoMenus(getAllPhotoMenus());
    console.log("Created sample photo menus with QR codes:", qrCodes);
  };

  const handleClearAll = () => {
    photoMenus.forEach(menu => deletePhotoMenu(menu.qrCode));
    setPhotoMenus([]);
  };

  const handleViewSample = () => {
    const testQR = getTestPhotoMenuQR();
    window.open(`/menu/${testQR}`, '_blank');
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Photo Menu Tester</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <Button onClick={handleCreateSamples} variant="outline">
            Create Sample Photo Menus
          </Button>
          <Button onClick={handleViewSample}>
            View Sample Menu
          </Button>
          <Button onClick={handleClearAll} variant="outline">
            Clear All
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Stored Photo Menus ({photoMenus.length})</h4>
          {photoMenus.length === 0 ? (
            <p className="text-sm text-gray-500">No photo menus stored. Create samples to test.</p>
          ) : (
            <div className="space-y-2">
              {photoMenus.map(menu => (
                <div key={menu.qrCode} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{menu.restaurant.name}</div>
                    <div className="text-sm text-gray-600">
                      QR: {menu.qrCode} • {menu.images.length} images
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/menu/${menu.qrCode}`, '_blank')}
                    >
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        deletePhotoMenu(menu.qrCode);
                        setPhotoMenus(getAllPhotoMenus());
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}