import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { ClientJS } from "clientjs";

export interface DeviceInfoType {
  fingerprint: string;
  mobile: boolean;
  system: string;
  systemVersion: string;
  browser: string;
  screenWidth: string;
}

// Função para ser usada fora de componentes React
export const getDeviceInfo = async (): Promise<DeviceInfoType> => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  const client = new ClientJS();
  const isMobile = client.isMobile();
  const os = client.getOS();
  const osVersion = client.getOSVersion();
  const browser = client.getBrowser();
  const screenWidth = `${window.innerWidth}x${window.innerHeight}`;

  return {
    fingerprint: result.visitorId,
    mobile: isMobile,
    system: os,
    systemVersion: osVersion,
    browser,
    screenWidth,
  };
};

// Hook para uso dentro de componentes
import { useEffect, useState } from "react";

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoType | null>(null);

  useEffect(() => {
    getDeviceInfo().then(setDeviceInfo);
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;