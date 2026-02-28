type TFunction = (key: string) => string;

const SERVICE_KEY_MAP: Record<string, string> = {
  electricity: "service_electricity",
  power: "service_electricity",
  gas: "service_gas",
  water: "service_water",
  waste: "service_waste",
  property: "service_property",
  certificates: "service_certificates",
  municipal: "service_municipal",
};

const STATUS_KEY_MAP: Record<string, string> = {
  pending: "status_pending",
  completed: "status_completed",
  complete: "status_completed",
  in_progress: "status_in_progress",
  "in progress": "status_in_progress",
  rejected: "status_rejected",
  paid: "status_completed",
  unread: "unread",
  read: "read",
};

const RECEIPT_MODE_KEY_MAP: Record<string, string> = {
  both: "receipt_mode_both",
  digital: "receipt_mode_digital",
  print: "receipt_mode_print",
};

const LANGUAGE_KEY_MAP: Record<string, string> = {
  en: "language_english",
  hi: "language_hindi",
  mr: "language_marathi",
  ta: "language_tamil",
};

const START_PAGE_KEY_MAP: Record<string, string> = {
  home: "return_home",
  services: "select_service_title",
  track: "track_status",
  profile: "menu_view_profile",
};

export const localizeServiceType = (value: string, t: TFunction): string => {
  const key = SERVICE_KEY_MAP[value.trim().toLowerCase()];
  return key ? t(key) : value;
};

export const localizeStatus = (value: string, t: TFunction): string => {
  const key = STATUS_KEY_MAP[value.trim().toLowerCase()];
  return key ? t(key) : value;
};

export const localizeReceiptMode = (value: string, t: TFunction): string => {
  const key = RECEIPT_MODE_KEY_MAP[value.trim().toLowerCase()];
  return key ? t(key) : value;
};

export const localizeLanguage = (value: string, t: TFunction): string => {
  const key = LANGUAGE_KEY_MAP[value.trim().toLowerCase()];
  return key ? t(key) : value;
};

export const localizeStartPage = (value: string, t: TFunction): string => {
  const key = START_PAGE_KEY_MAP[value.trim().toLowerCase()];
  return key ? t(key) : value;
};
