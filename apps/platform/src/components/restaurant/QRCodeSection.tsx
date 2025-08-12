import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { QrCode, Download, ExternalLink } from 'lucide-react';

interface QRCodeSectionProps {
  qrData: Array<{
    code: string;
    menu_url: string;
  }>;
  restaurantName?: string;
  onDownloadQR: () => void;
}

export default function QRCodeSection({ qrData, restaurantName, onDownloadQR }: QRCodeSectionProps) {
  if (!qrData || qrData.length === 0) {
    return null;
  }

  const qrCode = qrData[0];

  return (
    <Card className="h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-gray-500" />
            QR Code
          </h3>
          <div className="flex gap-1">
            <Button 
              onClick={onDownloadQR} 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900"
              title="Download QR Code"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => window.open(`/menu/${qrCode.code}`, '_blank')}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900"
              title="View Menu"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <QRCodeDisplay 
                value={qrCode.menu_url} 
                size={120}
                className="rounded"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">Code</div>
              <div className="text-sm font-mono text-gray-900">{qrCode.code}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                Active
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">URL</div>
              <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all text-gray-600">
                {qrCode.menu_url}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}