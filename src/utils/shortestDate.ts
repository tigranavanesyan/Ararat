export const shortestDate = (targetDay: number) => {
    const date = new Date(),
    targetDate = new Date(),
    delta = targetDay - date.getDay();

    if (delta >= 0) {targetDate.setDate(date.getDate() + delta)}
    else {targetDate.setDate(date.getDate() + 7 + delta)}


    return targetDate
}