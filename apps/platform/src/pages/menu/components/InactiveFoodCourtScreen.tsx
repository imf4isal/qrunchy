import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock } from "lucide-react";

interface InactiveFoodCourtScreenProps {
  foodCourtName?: string;
}

export default function InactiveFoodCourtScreen({ foodCourtName }: InactiveFoodCourtScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Food Court Pending Activation
            </h1>
            {foodCourtName && (
              <p className="text-lg text-gray-600 mb-4">
                {foodCourtName}
              </p>
            )}
            <p className="text-gray-600 leading-relaxed">
              This food court is currently pending activation by our admin team. 
              Please check back later or contact support for more information.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Activation Required</p>
                <p>
                  Food courts require admin approval before becoming accessible to customers.
                  This process typically takes 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Refresh Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full"
            >
              Go Back
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team for assistance with activation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}