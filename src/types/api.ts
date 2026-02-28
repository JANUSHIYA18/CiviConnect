export interface AppUser {
  id: string;
  phone: string;
  aadhaarLinked?: boolean;
  profileId?: string;
  fullName?: string;
}

export interface ProfileSummary {
  profileId: string;
  fullName: string;
  phone: string;
  ward: string;
  updatedAt: string;
}

export interface ProfileReminder {
  reminderId: string;
  title: string;
  dueDate: string;
  status: string;
}

export interface ProfileDetails {
  profileId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  aadhaarMasked: string;
  reminders: ProfileReminder[];
  updatedAt: string;
}

export interface PendingBill {
  billRef: string;
  serviceType: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface NotificationItem {
  notificationId: string;
  title: string;
  message: string;
  createdAtLabel: string;
  read: boolean;
}

export interface ProfileSettings {
  language: string;
  receiptMode: string;
  smsAlerts: boolean;
  emailAlerts: boolean;
  pushAlerts: boolean;
  kioskAccessibilityMode: boolean;
  highContrastMode: boolean;
  largeTextMode: boolean;
  biometricLock: boolean;
  autoLogoutMinutes: number;
  defaultService: string;
  startPage: string;
  paperlessReceipts: boolean;
}

export interface HelpItem {
  topic: string;
  details: string;
  contact: string;
}

export interface ReceiptDetails {
  transactionRef: string;
  serviceType: string;
  accountId: string;
  amount: number;
  status: string;
  billPeriod: string;
  receiptMode: string;
  transactionDateTime: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  aadhaarMasked: string;
}

export interface DownloadRecord {
  transactionRef: string;
  fileName: string;
  serviceType: string;
  amount: number;
  downloadedAt: string;
}
