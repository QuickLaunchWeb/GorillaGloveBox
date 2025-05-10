import axios from 'axios';
import https from 'https';

export interface ConnectionResult {
  success: boolean;
  message: string;
  data?: any;  // Optional response data
}

export const testKongConnection = async (
  url: string, 
  skipTlsVerify: boolean
): Promise<ConnectionResult> => {
  try {
    const agent = skipTlsVerify 
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;
      
    const response = await axios.get(`${url}/status`, { httpsAgent: agent });
    return { 
      success: true, 
      message: 'Connection successful',
      data: response.data
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Connection failed'
    };
  }
};
