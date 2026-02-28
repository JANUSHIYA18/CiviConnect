export const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const generateRef = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

export const formatDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 15);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatBillPeriod = () => {
  const now = new Date();
  return now.toLocaleString("en-IN", { month: "short", year: "numeric" });
};
