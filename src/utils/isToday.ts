import dayjs from "dayjs";

export function isToday(dateStr: string): boolean {
  return dayjs(dateStr, "DD/MM/YYYY").isSame(dayjs(), "day");
}

