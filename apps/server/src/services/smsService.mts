export interface SMSResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class SMSService {
  private baseUrl = "https://portal.smsorbis.com/api/sendSMS";

  // Get API key dynamically to ensure it's loaded after dotenv
  private getApiKey(): string {
    return process.env.SMS_ORBIS_API_KEY || "";
  }

  // Get sender ID dynamically
  private getSenderId(): string {
    return process.env.SMS_ORBIS_SENDER_ID || "Qrunchy";
  }

  async sendOTP(mobileNumber: string, otpCode: string): Promise<SMSResponse> {
    try {
      console.log(`🚀 [SMS] Starting OTP send process for: ${mobileNumber}`);
      
      // Format mobile number for Bangladesh (ensure it starts with 880)
      let formattedNumber = mobileNumber.replace(/\D/g, ""); // Remove non-digits
      console.log(`🔧 [SMS] Original number: ${mobileNumber}, Cleaned: ${formattedNumber}`);

      if (formattedNumber.startsWith("01")) {
        formattedNumber = "880" + formattedNumber.substring(1);
        console.log(`🔧 [SMS] Converted local to international: ${formattedNumber}`);
      } else if (formattedNumber.startsWith("8801")) {
        console.log(`🔧 [SMS] Already in international format: ${formattedNumber}`);
      } else if (formattedNumber.startsWith("880")) {
        console.log(`🔧 [SMS] Already in international format: ${formattedNumber}`);
      } else {
        // Assume it's a local number and add 880
        formattedNumber = "880" + formattedNumber;
        console.log(`🔧 [SMS] Assumed local, converted to: ${formattedNumber}`);
      }

      const message = `Your Qrunchy verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code.`;

      const apiKey = this.getApiKey();
      const senderId = this.getSenderId();

      console.log(`🔑 [SMS] API Key present: ${!!apiKey}`);
      console.log(`📞 [SMS] Sender ID: ${senderId}`);

      if (!apiKey) {
        console.warn("❌ [SMS] SMS_ORBIS_API_KEY not found in environment variables");
        return {
          success: false,
          error: "SMS API key not configured",
        };
      }

      const url = new URL(this.baseUrl);
      url.searchParams.append("ApiKey", apiKey);
      url.searchParams.append("SenderID", senderId);
      url.searchParams.append("number", formattedNumber);
      url.searchParams.append("sms", message);

      console.log(`🌐 [SMS] API URL: ${this.baseUrl}`);
      console.log(`📱 [SMS] Sending OTP to: ${formattedNumber} with OTP: ${otpCode}`);
      console.log(`💬 [SMS] Message: ${message}`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text();
      console.log(`📊 [SMS] Response Status: ${response.status}`);
      console.log(`📊 [SMS] Response Text: ${responseText}`);

      if (response.ok) {
        // Parse JSON response to check API status
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          // If JSON parsing fails, treat as error
          console.error(`❌ [SMS] Failed to parse JSON response:`, responseText);
          return {
            success: false,
            error: `SMS API Error: Invalid JSON response - ${responseText}`,
          };
        }

        // Check if API status indicates success (SMS Orbis uses "200" for success)
        if (responseData.status === "200" || responseData.status === 200) {
          console.log(`✅ [SMS] OTP sent successfully to ${formattedNumber}`);
          return {
            success: true,
            message: "OTP sent successfully",
          };
        } else {
          // HTTP 200 but API error status
          const errorMsg = responseData.msg || "Unknown API error";
          console.error(`❌ [SMS] API Error - HTTP: 200, API Status: ${responseData.status}, Message: ${errorMsg}`);
          return {
            success: false,
            error: `SMS API Error: ${errorMsg}`,
          };
        }
      } else {
        // HTTP error
        console.error(`❌ [SMS] HTTP Error (${response.status}):`, responseText);
        return {
          success: false,
          error: `SMS HTTP Error: ${responseText}`,
        };
      }
    } catch (error) {
      console.error("💥 [SMS] Exception in sendOTP:", error);
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
    const masterPassword = process.env.OTP_MASTER_PASSWORD;
    
    // Only allow master password if it's configured
    if (!masterPassword) {
      return false;
    }
    
    const isMatch = input === masterPassword;
    
    if (isMatch) {
      console.log("⚠️  WARNING: Master password used for OTP verification");
      console.log("   Consider disabling OTP_MASTER_PASSWORD in production");
    }
    
    return isMatch;
  }
}

// Export singleton instance
export const smsService = new SMSService();
