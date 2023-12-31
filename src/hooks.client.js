import { toasts } from "svelte-toasts";
import { countries } from "$lib/index.js";
const dateOptions = { month: "long", day: "numeric", year: "numeric" };

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
  const link = new URL("https://youtube.com");
  addParams(link, params);
  return link.href.replace("https://youtube.com", string);
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
  duration = 3000,
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
export function formatDate(date = new Date(), options = dateOptions) {
  const formatDate = date.toLocaleDateString("en-US", options);
  return formatDate;
}

export function formatDateTime(date = new Date(), options = dateOptions) {
  return `${formatDate(date, options)} at ${getTimeStr(date)}`;
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

export function formatDuration(startDate = new Date(), endDate = new Date()) {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(timeDifference / 3600000);
  const minutes = Math.floor((timeDifference % 3600000) / 60000);
  if (hours == 0) {
    return `${minutes.toLocaleString()} ${minutes == 1 ? "minute" : "minutes"}`;
  }
  if (minutes == 0) {
    return `${hours.toLocaleString()} ${hours == 1 ? "hour" : "hours"}`;
  }
  return `${hours.toLocaleString()} ${
    hours == 1 ? "hour" : "hours"
  } and ${minutes.toLocaleString()} ${minutes == 1 ? "minute" : "minutes"}`;
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
export function calculateMinutes(startDate = new Date(), endDate = new Date()) {
  const timeDifference = endDate.valueOf() - startDate.valueOf();
  const minutes = Math.floor(timeDifference / 60000);
  return minutes;
}

export async function fetchFromEndpoint(ref = "", params = {}) {
  return await fetch(ref, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "content-type": "application/json",
    },
  });
}
export function hasNormalCharacters(inputString = "") {
  return inputString.length == 0 ? true : /^[a-zA-Z0-9]+$/.test(inputString);
}

export function haversineDistanceNM(lat1, lon1, lat2, lon2) {
  // AI Generated Code
  const earthRadiusInNauticalMiles = 3440.065;
  const toRadians = (angle) => angle * (Math.PI / 180);
  const rl1 = toRadians(lat1);
  const rl2 = toRadians(lat2);
  const rl3 = toRadians(lat2 - lat1);
  const rl4 = toRadians(lon2 - lon1);
  const a =
    Math.sin(rl3 / 2) * Math.sin(rl3 / 2) +
    Math.cos(rl1) * Math.cos(rl2) * Math.sin(rl4 / 2) * Math.sin(rl4 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusInNauticalMiles * c;
  return distance;
}
