// apps/platform/src/pages/menu/components/ActivationScreen.tsx

import QrunchyFooter from "./QrunchyFooter";

interface ActivationScreenProps {
  expiresAt: string | null;
}

export default function ActivationScreen({ expiresAt }: ActivationScreenProps) {
  const getDaysUntilExpiry = (): number => {
    if (!expiresAt) return 0;
    return Math.ceil(
      (new Date(expiresAt).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const handleActivate = (): void => {
    // TODO: Implement activation logic
    console.log("Activation clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <span className="text-white font-bold text-xl">Q</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Menu Not Activated
        </h1>

        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <p className="text-gray-600 mb-4">
            This QR code was created but hasn't been activated yet.
          </p>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Restaurant Owner?
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              If you created this QR code, please create an account to activate
              your digital menu.
            </p>
            <button
              onClick={handleActivate}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Activate Menu
            </button>
          </div>

          {expiresAt && (
            <p className="text-sm text-gray-500">
              Expires in {getDaysUntilExpiry()} days
            </p>
          )}
        </div>

        <QrunchyFooter />
      </div>
    </div>
  );
}
