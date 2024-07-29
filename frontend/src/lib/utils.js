
import qs from "query-string";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const JobPageFilters = [
  { name: "Full-time", value: "fulltime" },
  { name: "Part-time", value: "parttime" },
  { name: "Contractor", value: "contractor" },
  { name: "Internship", value: "intern" },
];

const CURRENCY_NOTATIONS = {
  ALL: "Lek",
  AFN: "؋",
  ARS: "$",
  AWG: "ƒ",
  AUD: "$",
  AZN: "ман",
  BSD: "$",
  BYR: "p.",
  BZD: "BZ$",
  BMD: "$",
  BOB: "$b",
  BAM: "KM",
  BWP: "P",
  BGN: "лв",
  BRL: "R$",
  BND: "$",
  KHR: "៛",
  CAD: "$",
  KYD: "$",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  HRK: "kn",
  CUP: "₱",
  CZK: "Kč",
  DKK: "kr",
  DOP: "RD$",
  XCD: "$",
  EGP: "£",
  SVC: "$",
  EEK: "kr",
  EUR: "€",
  FKP: "£",
  FJD: "$",
  GHC: "¢",
  GIP: "£",
  GTQ: "Q",
  GGP: "£",
  GYD: "$",
  HNL: "L",
  HKD: "$",
  HUF: "Ft",
  ISK: "kr",
  INR: "₹",
  IDR: "Rp",
  IRR: "﷼",
  IMP: "£",
  ILS: "₪",
  JMD: "J$",
  JPY: "¥",
  JEP: "£",
  KZT: "лв",
  KPW: "₩",
  KRW: "₩",
  KGS: "лв",
  LAK: "₭",
  LVL: "Ls",
  LBP: "£",
  LRD: "$",
  LTL: "Lt",
  MKD: "ден",
  MYR: "RM",
  MUR: "₨",
  MXN: "$",
  MNT: "₮",
  MZN: "MT",
  NAD: "$",
  NPR: "₨",
  ANG: "ƒ",
  NZD: "$",
  NIO: "C$",
  NGN: "₦",
  NOK: "kr",
  OMR: "﷼",
  PKR: "₨",
  PAB: "B/.",
  PYG: "Gs",
  PEN: "S/.",
  PHP: "₱",
  PLN: "zł",
  QAR: "﷼",
  RON: "lei",
  RUB: "руб",
  SHP: "£",
  SAR: "﷼",
  RSD: "Дин.",
  SCR: "₨",
  SGD: "$",
  SBD: "$",
  SOS: "S",
  ZAR: "R",
  LKR: "₨",
  SEK: "kr",
  CHF: "CHF",
  SRD: "$",
  SYP: "£",
  TWD: "NT$",
  THB: "฿",
  TTD: "$",
  TRY: "₤",
  TRL: "₤",
  TVD: "$",
  UAH: "₴",
  GBP: "£",
  USD: "$",
  UYU: "$U",
  UZS: "лв",
  VEF: "Bs",
  VND: "₫",
  YER: "﷼",
  ZWD: "Z$",
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const HOST="http://localhost:3001"
export const getCountryCode = async (country) => {
  let countryCode = "";
  await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
      .then((response) => response.json())
      .then((data) => {
        countryCode = data[0].cca2.toString();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    return countryCode;
}
export const getTimestamp = (createdAt) => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  const timeUnits = [
    { unit: "year", milliseconds: 365 * 24 * 60 * 60 * 1000 },
    { unit: "month", milliseconds: 30 * 24 * 60 * 60 * 1000 },
    { unit: "week", milliseconds: 7 * 24 * 60 * 60 * 1000 },
    { unit: "day", milliseconds: 24 * 60 * 60 * 1000 },
    { unit: "hour", milliseconds: 60 * 60 * 1000 },
    { unit: "minute", milliseconds: 60 * 1000 },
    { unit: "second", milliseconds: 1000 },
  ];

  for (const { unit, milliseconds } of timeUnits) {
    const time= Math.floor(timeDifference / milliseconds);
    if (time >= 1) {
      return `${time} ${unit}${time === 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

export const getFormattedNumber = (number) => {
  if (number < 1000) return number.toString(); // Return the same number
  if (number < 1000000) return `${(number / 1000).toFixed(1)}K`; // Convert to K for number from 1000 < n < 1 million
  if (number < 1000000000) return `${(number / 1000000).toFixed(1)}M`; // Convert to M for number from 1 million < n < 1 billion
  return `${(number / 1000000000).toFixed(1)}B`; // Convert to B for number n > 1 billion
};

export const getFormattedJoinedDate = (date) => {
  const month = date.toLocaleString("en", { month: "long" });
  const year = date.getFullYear();

  return `Joined ${month} ${year}`;
};

export const formUrlQuery = ({
  params,
  key,
  value,
}) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: currentUrl,
      },
      { skipNull: true }
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: currentUrl,
      },
      { skipNull: true }
  );
};

export const employmentTypeConverter = (type) => {
  let employmentType = "";

  JobPageFilters.forEach((filter) => {
    if (filter.value === type) {
      employmentType = filter.name;
    }
  });

  return employmentType;
};

export const getFormattedSalary = ({
                                     min,
                                     max,
                                     currency,
                                     period,
                                   }) => {
  if (!min || !max) return null;

  const salaryInfo = {
    symbol: CURRENCY_NOTATIONS[currency] || "$",
    low: salaryFormatter(min, 1),
    high: salaryFormatter(max, 1),
    per: period ? `/${period.toLowerCase()}ly` : "",
  };

  const { symbol, low, high, per } = salaryInfo;
  return `${symbol}${low} - ${symbol}${high}${per}`;
};


const salaryFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const lookupItem = lookup
      .slice()
      .reverse()
      .find((item) => num >= item.value);
  return lookupItem
      ? (num / lookupItem.value).toFixed(digits).replace(rx, "$1") +
      lookupItem.symbol
      : "0";
};

export function isValidImage(url) {
  return /\.(jpg|jpeg|png|webp||svg)$/.test(url);
}
