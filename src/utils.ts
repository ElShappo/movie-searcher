function prependZeroToDate(date: number) {
  if (date.toString().length === 1) {
    return `0${date}`;
  }
  return date;
}

export function prettifyDate(dateString: string, detailed = true) {
  const date = new Date(dateString);
  let res = `${date.getFullYear()}-${prependZeroToDate(date.getMonth() + 1)}-${prependZeroToDate(date.getDate())}`;
  if (detailed) {
    res += ` в ${date.getHours()}:${prependZeroToDate(date.getMinutes())}`;
  }
  return res;
}
