interface PhotoMenuPlaceholderProps {
  qrCode: string;
}

export default function PhotoMenuPlaceholder({
  qrCode,
}: PhotoMenuPlaceholderProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <span className="text-white font-bold text-xl">Q</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Photo Menu Viewer
        </h1>
        <p className="text-gray-600 mb-6">Coming Soon - QR Code: {qrCode}</p>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-600">
            This will display the photo menu carousel when implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
