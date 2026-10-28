export type DeviceKind = "mobile" | "tablet" | "desktop";
export type Platform = "ios" | "android" | "other";

export type ParsedUserAgent = {
  browser: string | null;
  os: string | null;
  device: DeviceKind;
  platform: Platform;
};

// Orden importante: Edge, Opera o Samsung también dicen "Chrome"; Chrome en iOS también dice "Safari".
const BROWSERS: [RegExp, string][] = [
  [/\bEdg(?:e|A|iOS)?\//, "Edge"],
  [/\bOPR\/|\bOpera\b/, "Opera"],
  [/\bSamsungBrowser\//, "Samsung Internet"],
  [/\bFxiOS\/|\bFirefox\//, "Firefox"],
  [/\bCriOS\/|\bChrome\/|\bHeadlessChrome\//, "Chrome"],
  [/\bGSA\//, "Google"],
  [/\bVersion\/[\d.]+.*\bSafari\//, "Safari"],
];

/** Parser sencillo de user agent: lo justo para mostrar "Safari en iPhone" en la lista de sesiones. */
export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  const value = ua ?? "";
  let os: string | null = null;
  let device: DeviceKind = "desktop";
  let platform: Platform = "other";

  if (/\biPhone\b|\biPod\b/.test(value)) {
    os = "iPhone";
    device = "mobile";
    platform = "ios";
  } else if (/\biPad\b/.test(value)) {
    os = "iPad";
    device = "tablet";
    platform = "ios";
  } else if (/\bAndroid\b/.test(value)) {
    os = "Android";
    device = /\bMobile\b/.test(value) ? "mobile" : "tablet";
    platform = "android";
  } else if (/\bWindows NT\b/.test(value)) {
    os = "Windows";
  } else if (/\bCrOS\b/.test(value)) {
    os = "ChromeOS";
  } else if (/\bMac OS X\b|\bMacintosh\b/.test(value)) {
    os = "Mac";
  } else if (/\bLinux\b/.test(value)) {
    os = "Linux";
  }

  const browser = BROWSERS.find(([pattern]) => pattern.test(value))?.[1] ?? null;
  return { browser, os, device, platform };
}

/** "Safari en iPhone", "Chrome en Windows"… */
export function describeDevice({ browser, os }: Pick<ParsedUserAgent, "browser" | "os">): string {
  if (browser && os) return `${browser} en ${os}`;
  return os ?? browser ?? "Dispositivo desconocido";
}
