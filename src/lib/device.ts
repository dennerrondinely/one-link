export interface DeviceInfo {
  isMobile: boolean;
  isDesktop: boolean;
  isiOS: boolean;
  isAndroid: boolean;
  platform: string;
  browser: string;
}

export function getDeviceInfo(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  const isiOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isMobile = isiOS || isAndroid || /mobile/.test(ua);

  let platform = "Unknown";
  if (isiOS) platform = "iOS";
  else if (isAndroid) platform = "Android";
  else if (/windows/.test(ua)) platform = "Windows";
  else if (/mac os x|macintosh/.test(ua)) platform = "MacOS";
  else if (/linux/.test(ua)) platform = "Linux";

  let browser = "Unknown";
  if (/edg\//.test(ua)) browser = "Edge";
  else if (/chrome\//.test(ua) && !/edg\//.test(ua)) browser = "Chrome";
  else if (/safari\//.test(ua) && !/chrome\//.test(ua)) browser = "Safari";
  else if (/firefox\//.test(ua)) browser = "Firefox";

  return {
    isMobile,
    isDesktop: !isMobile,
    isiOS,
    isAndroid,
    platform,
    browser,
  };
}