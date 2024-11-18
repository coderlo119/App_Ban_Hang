import { DateTime } from "luxon";

const customizeRelativeDate = (relativeDate: string | null) => {
  if (relativeDate) {
    return relativeDate
      .replace("hours", "hrs")
      .replace("hour", "hr")
      .replace("minutes", "min")
      .replace("minute", "min")
      .replace("seconds", "sec")
      .replace("second", "sec");
  }
};

export const formatDate = (dateString: string, format = "") => {
  const date = DateTime.fromISO(dateString);
  if (format) {
    return date.toFormat(format);
  }

  const now = DateTime.now();
  //nếu ngày đó nằm trong 7 ngày vừa qua
  if (date.hasSame(now, "day")) {
    return customizeRelativeDate(date.toRelative());
  }
  //kiểm tra xem có phải ngày hôm này không
  else if (date.hasSame(now.minus({ days: 1 }), "day")) {
    return "Yesterday";
  }
  //kiểm tra nếu nó đến từ cùng 1 tuần
  else if (date > now.minus({ days: 6 })) {
    return date.toFormat("EEE");
  } else {
    return date.toFormat("dd/MM/yy");
  }
};
