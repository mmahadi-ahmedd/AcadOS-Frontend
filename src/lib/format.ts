export const money = (n: number | string) => `৳${Number(n).toLocaleString("en-US")}`;

export const shortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });