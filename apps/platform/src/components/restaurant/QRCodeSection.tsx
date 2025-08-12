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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Your Menu QR Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">QR Code Details</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Code:</span> {qrCode.code}</p>
                <p><span className="font-medium">Status:</span> Active</p>
                <p><span className="font-medium">Menu URL:</span></p>
                <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
                  {qrCode.menu_url}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onDownloadQR} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
              <Button
                onClick={() => window.open(`/menu/${qrCode.code}`, '_blank')}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Menu
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCodeDisplay 
                value={qrCode.menu_url} 
                size={192}
                className="rounded"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}