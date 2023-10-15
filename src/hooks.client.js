import { toasts } from "svelte-toasts";
import countries from "./data/countries.json";
export function randomNum(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}
export function addParams(link = new URL(), params) {
  for (const key in params) {
    const value = params[key];
    link.searchParams.append(key, value);
  }
}
export function addParamsString(string = "", params = {}) {
  const link = new URL("https://codevault.com");
  addParams(link, params);
  return link.toString().replace("https://codevault.com", string);
}
export function delelteAllParams(link = new URL()) {
  link.searchParams.forEach((_value, key) => {
    link.searchParams.delete(key);
  });
}

export function simplifyString(str) {
  for (let i = 0; i < str.length; i++) {
    str = str.replace(/\s/g, "").toLowerCase();
  }
  return str;
}
export function createToast(
  type,
  title,
  description,
  duration = 5000,
  placement = "bottom-center"
) {
  return toasts.add({
    title: title,
    description: description,
    duration: duration,
    placement: placement,
    type: type,
    theme: "dark",
    showProgress: true,
  });
}

export function maxLen(string = "", maxLen = NaN) {
  if (maxLen >= string.length) {
    return string;
  }
  let newString = "";
  for (let i in string) {
    if (i == maxLen - 3) {
      return newString + "...";
    }
    newString += string[i];
  }
  return string;
}

export function formatDateStr(dateStr) {
  return formatDate(new Date(dateStr));
}
export function formatDate(date = new Date()) {
  const dateOptions = { month: "long", day: "numeric", year: "numeric" };
  const formatDate = date.toLocaleDateString("en-US", dateOptions);
  return formatDate;
}

export function dateToStr(date = new Date()) {
  return date.toISOString().split("T")[0];
}
export function GetSortOrder(prop, reverse = false) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return reverse ? -1 : 1;
    } else if (a[prop] < b[prop]) {
      return reverse ? 1 : -1;
    }
    return 0;
  };
}

export function getTimeStr(date = new Date()) {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
export function parseDateAndTime(dateString, timeString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

export function copyToClipboard(text = "") {
  try {
    navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
  }
}
export function formatDuration(startDate = new Date(), endDate = new Date()) {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(timeDifference / 3600000);
  const minutes = Math.floor((timeDifference % 3600000) / 60000);
  return `${hours.toLocaleString()} ${
    hours == 1 ? "hour" : "hours"
  } and ${minutes.toLocaleString()} ${minutes == 1 ? "minute" : "minutes"} `;
}

export function getCountryByCode(code = "") {
  code = code.toUpperCase();
  for (const i of countries) {
    if (i.code === code) {
      return i.name;
    }
  }
  return null;
}
export function getOpenStreetMap(latitude, longitude) {
  if (!latitude || !longitude) {
    return "https://www.openstreetmap.org/export/embed.html?bbox=-132.67089843750003%2C21.779905342529645%2C-59.28222656250001%2C51.781435604431195&amp;layer=mapnik";
  }
  const degrees = 30 / 111.32;
  const bbox = [
    longitude - degrees,
    latitude - degrees,
    longitude + degrees,
    latitude + degrees,
  ].join(",");
  const marker = `${latitude},${longitude}`;
  const embedLink = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&marker=${marker}`;
  return embedLink;
}
