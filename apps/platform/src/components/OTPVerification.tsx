import { useState, useEffect, useRef } from "react";
import { Loader2, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";

interface OTPVerificationProps {
  mobileNumber: string;
  onVerificationSuccess: () => void;
  onCancel?: () => void;
  isOpen: boolean;
}

export default function OTPVerification({
  mobileNumber,
  onVerificationSuccess,
  onCancel,
  isOpen,
}: OTPVerificationProps) {
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mutations
  const sendOTPMutation = trpc.auth.sendOTP.useMutation();
  const verifyOTPMutation = trpc.auth.verifyOTP.useMutation();

  // Auto-send OTP when component opens
  useEffect(() => {
    if (isOpen && mobileNumber) {
      handleSendOTP();
    }
  }, [isOpen, mobileNumber]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Focus management for OTP inputs
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6);
      setOtpCode(pastedCode);
      
      // Fill inputs
      for (let i = 0; i < 6; i++) {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = pastedCode[i] || "";
        }
      }
      
      // Focus last filled input
      const lastIndex = Math.min(pastedCode.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Update OTP code
    const newOTP = otpCode.split("");
    newOTP[index] = value;
    const updatedOTP = newOTP.join("");
    setOtpCode(updatedOTP);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = async () => {
    try {
      setError("");
      await sendOTPMutation.mutateAsync({ mobile_number: mobileNumber });
      setTimeLeft(300); // Reset timer
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await verifyOTPMutation.mutateAsync({
        mobile_number: mobileNumber,
        otp_code: otpCode,
      });
      
      onVerificationSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Verify Your Number
          </h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit code to{" "}
            <span className="font-medium">{mobileNumber}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter verification code
            </label>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-12 h-12 text-center text-lg font-bold"
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isVerifying}
                />
              ))}
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                You can also enter "654321" for testing
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otpCode.length !== 6}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                {timeLeft > 0 ? (
                  `Resend in ${formatTime(timeLeft)}`
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendOTP}
                    disabled={sendOTPMutation.isLoading || !canResend}
                    className="h-auto p-0 text-blue-600 hover:text-blue-700"
                  >
                    {sendOTPMutation.isLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                )}
              </div>

              {onCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-auto p-0 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}