function isSameDate(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}

/**
 * @param refreshRate in ms
 * @returns function to cancel the event subscription
 */
export default function onDateChange(callback: () => void, checkRate = 1000): () => void {
  let lastDate = new Date();

  const intervalId = setInterval(() => {
    const currentDate = new Date();

    if (!isSameDate(lastDate, currentDate)) {
      lastDate = currentDate;
      callback();
    }
  }, checkRate);

  return () => clearInterval(intervalId);
}
