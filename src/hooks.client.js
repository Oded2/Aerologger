import { createClient } from "@supabase/supabase-js";
import { toasts } from "svelte-toasts";
const sbUrl = "https://njcypmepfxckouqjunrr.supabase.co";

export function randomNum(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}
export function addParams(link = new URL(), params) {
  for (const key in params) {
    const value = params[key];
    link.searchParams.append(key, value);
  }
}
export function addParamsString(string, params) {
  const link = new URL("https://codevault.com");
  addParams(link, params);
  return link.toString().replace("https://codevault.com", string);
}

export async function getUserDetails(api) {
  const sb = createSbClient(api);
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    return;
  }
  const user = data.session.user;
  return {
    id: user.id,
    email: user.email,
    fname: user.user_metadata.first_name,
    lname: user.user_metadata.last_name,
  };
}

export function simplifyString(str) {
  for (let i = 0; i < str.length; i++) {
    str = str.replace(/\s/g, "").toLowerCase();
  }
  return str;
}
export function createSbClient(api) {
  return createClient(sbUrl, api);
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
export function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

export function getTimeStr(date = new Date()) {
  return `${date.getHours()}:${date.getMinutes().toString().padEnd(2, "0")}`;
}
export function parseDateAndTime(dateString, timeString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}
