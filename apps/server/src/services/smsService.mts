export interface SMSResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class SMSService {
  private apiKey: string;
  private senderId: string;
  private baseUrl = "https://portal.smsorbis.com/api/sendSMS";

  constructor() {
    this.apiKey = process.env.SMS_ORBIS_API_KEY || "";
    this.senderId = process.env.SMS_ORBIS_SENDER_ID || "Qrunchy";

    if (!this.apiKey) {
      console.warn("SMS_ORBIS_API_KEY not found in environment variables");
    }
  }

  async sendOTP(mobileNumber: string, otpCode: string): Promise<SMSResponse> {
    try {
      // Format mobile number for Bangladesh (ensure it starts with 880)
      let formattedNumber = mobileNumber.replace(/\D/g, ""); // Remove non-digits

      if (formattedNumber.startsWith("01")) {
        formattedNumber = "880" + formattedNumber.substring(1);
      } else if (formattedNumber.startsWith("8801")) {
        // Already formatted correctly
      } else if (formattedNumber.startsWith("880")) {
        // Already formatted correctly
      } else {
        // Assume it's a local number and add 880
        formattedNumber = "880" + formattedNumber;
      }

      const message = `Your Qrunchy verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code.`;

      const url = new URL(this.baseUrl);
      url.searchParams.append("ApiKey", this.apiKey);
      url.searchParams.append("SenderID", this.senderId);
      url.searchParams.append("number", formattedNumber);
      url.searchParams.append("sms", message);

      console.log("📱 Sending OTP SMS to:", formattedNumber);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text();
      console.log("📱 SMS API Response:", responseText);

      if (response.ok) {
        return {
          success: true,
          message: "OTP sent successfully",
        };
      } else {
        console.error("SMS API Error:", responseText);
        return {
          success: false,
          error: `SMS API Error: ${responseText}`,
        };
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown SMS error",
      };
    }
  }

  // Generate a 6-digit OTP code
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Validate OTP format
  isValidOTP(otp: string): boolean {
    return /^\d{6}$/.test(otp);
  }

  // Check if it's the master password
  isMasterPassword(input: string): boolean {
    return input === "654321"; // 6-digit master password for testing
  }
}

// Export singleton instance
export const smsService = new SMSService();
