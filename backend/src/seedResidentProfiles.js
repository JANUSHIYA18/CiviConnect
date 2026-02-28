import { Profile } from "./models/Profile.js";

const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Ishaan",
  "Riya",
  "Ananya",
  "Meera",
  "Kavya",
  "Rahul",
  "Priya",
];

const lastNames = [
  "Sharma",
  "Verma",
  "Patel",
  "Reddy",
  "Gupta",
  "Nair",
  "Iyer",
  "Singh",
  "Das",
  "Khan",
];

const areas = [
  "Mahatma Gandhi Road",
  "Nehru Nagar",
  "Lake View Colony",
  "Temple Street",
  "Market Lane",
  "Station Road",
  "Green Park",
  "Civil Lines",
];

const serviceTypes = ["electricity", "water", "gas", "waste", "property"];

const pad = (value) => String(value).padStart(3, "0");

const buildProfilePayload = (index) => {
  const number = index + 1;
  const profileId = `RES-${pad(number)}`;
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 3) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  const phone = `9${String(100000000 + number).padStart(9, "0")}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${number}@example.in`;
  const address = `${(index % 48) + 1}, ${areas[index % areas.length]}, Bengaluru`;
  const ward = `Ward ${(index % 25) + 1}`;
  const aadhaarMasked = `XXXX-XXXX-${String(1000 + number).slice(-4)}`;

  const pendingBills = serviceTypes.slice(0, 3).map((serviceType, billIndex) => ({
    billRef: `BILL-${pad(number)}-${billIndex + 1}`,
    serviceType,
    amount: 400 + ((index + 1) * (billIndex + 2) * 37) % 5000,
    dueDate: `${10 + billIndex} Mar 2026`,
    status: "pending",
  }));

  const notifications = [
    {
      notificationId: `NTF-${pad(number)}-1`,
      title: "Service Reminder",
      message: `Your ${pendingBills[0].serviceType} bill is due in the coming week.`,
      createdAtLabel: "Today, 09:30 AM",
      read: false,
    },
    {
      notificationId: `NTF-${pad(number)}-2`,
      title: "Receipt Delivered",
      message: "A digital receipt has been sent to your registered contact channels.",
      createdAtLabel: "Today, 08:10 AM",
      read: index % 2 === 0,
    },
    {
      notificationId: `NTF-${pad(number)}-3`,
      title: "Water Supply Advisory",
      message: "Scheduled maintenance in your ward is planned for Sunday from 8 AM to 12 PM.",
      createdAtLabel: "Yesterday, 05:10 PM",
      read: index % 3 === 0,
    },
    {
      notificationId: `NTF-${pad(number)}-4`,
      title: "Profile Security Alert",
      message: "Your account session was accessed from a kiosk terminal today.",
      createdAtLabel: "2 days ago, 11:25 AM",
      read: false,
    },
    {
      notificationId: `NTF-${pad(number)}-5`,
      title: "Community Update",
      message: "Door-to-door waste collection timings were updated in your locality.",
      createdAtLabel: "3 days ago, 04:40 PM",
      read: index % 4 === 0,
    },
  ];

  const reminders = [
    {
      reminderId: `RMD-${pad(number)}-1`,
      title: "Pay electricity dues",
      dueDate: "15 Mar 2026",
      status: "upcoming",
    },
    {
      reminderId: `RMD-${pad(number)}-2`,
      title: "Water bill payment window closes",
      dueDate: "18 Mar 2026",
      status: "upcoming",
    },
    {
      reminderId: `RMD-${pad(number)}-3`,
      title: "Property tax self-assessment submission",
      dueDate: "25 Mar 2026",
      status: "upcoming",
    },
    {
      reminderId: `RMD-${pad(number)}-4`,
      title: "Update emergency contact details",
      dueDate: "30 Mar 2026",
      status: index % 6 === 0 ? "completed" : "upcoming",
    },
    {
      reminderId: `RMD-${pad(number)}-5`,
      title: "Renew sanitation service request",
      dueDate: "05 Apr 2026",
      status: "upcoming",
    },
  ];

  const settings = {
    language: index % 3 === 0 ? "Kannada" : "English",
    receiptMode: index % 2 === 0 ? "both" : "sms",
    smsAlerts: true,
    emailAlerts: index % 2 === 0,
    pushAlerts: true,
    kioskAccessibilityMode: index % 5 === 0,
    highContrastMode: index % 7 === 0,
    largeTextMode: index % 8 === 0,
    biometricLock: index % 3 === 0,
    autoLogoutMinutes: index % 3 === 0 ? 2 : 3,
    defaultService: serviceTypes[index % serviceTypes.length],
    startPage: index % 2 === 0 ? "services" : "profile",
    paperlessReceipts: index % 2 === 0,
  };

  const help = [
    {
      topic: "How to pay pending bills",
      details: "Choose a bill type, enter account ID, review the amount, and complete payment.",
      contact: "Helpline: 1800-123-4545",
    },
    {
      topic: "How to track requests",
      details: "Use your complaint, service request, or transaction reference in Track Status.",
      contact: "Email: helpdesk@suvidhaone.in",
    },
  ];

  return {
    profileId,
    fullName,
    phone,
    email,
    address,
    ward,
    aadhaarMasked,
    pendingBills,
    notifications,
    reminders,
    settings,
    help,
  };
};

export const ensureResidentProfiles = async () => {
  const ids = Array.from({ length: 100 }, (_, index) => `RES-${pad(index + 1)}`);

  const operations = Array.from({ length: 100 }).map((_, index) => {
    const payload = buildProfilePayload(index);
    return {
      updateOne: {
        filter: { profileId: payload.profileId },
        update: { $set: payload },
        upsert: true,
      },
    };
  });

  await Profile.bulkWrite(operations, { ordered: false });
  await Profile.deleteMany({ profileId: { $nin: ids } });
};
