import dayjs from 'dayjs'
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

/**
 * 计算两个时间(时:分)之间的时间差
 * @param startTime: 开始时间字符串, 格式 HH:mm
 * @param endTime: 结束时间字符串, 格式 HH:mm
 * @param format: YYYY MM DD HH mm ss 随意组合
 * @param unit: "minute" | "hour"
 */
export const calcDiff = (startTime: string, endTime: string, unit: string) => {
  const stParts = startTime.split(':');
  const etParts = endTime.split(':');
  // 转换成分钟数
  const stMinutes = parseInt(stParts[0]) * 60 + parseInt(stParts[1])
  const etMinutes = parseInt(etParts[0]) * 60 + parseInt(etParts[1])
  // 计算两个时间差多少分钟
  var diff = etMinutes - stMinutes
  // 如果结束时间小于开始时间，说明时间已经是第二天了，
  if (diff < 0) {
    diff += 24 * 60
  }

  switch (unit) {
    case 'second':
      return diff * 60;
    case 'minute':
      return diff;
    case 'hour':
      return subNumber(diff / 60, 1);
    default:
      throw new Error("Invalid time unit, should be in ['second' | 'minute' | 'hour']");
  }

}

export const formatDate = (date: string, format: string): string => {
  return dayjs(date).format(format)
}
export const weekDay = (week: number): string => {
  var datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return datelist[week];
};

export const isYesterday = (date: string): boolean => {
  var yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  var d = new Date(date)

  return d.toLocaleDateString() === yesterday.toLocaleDateString()
}

export const isToday = (date: string): boolean => {
  var now = new Date()
  var d = new Date(date)

  return d.toLocaleDateString() === now.toLocaleDateString()
}

export const isTomorrow = (date: string): boolean => {
  var tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  var d = new Date(date)

  return d.toLocaleDateString() === tomorrow.toLocaleDateString()
}

export const humenWeek = (date: string): string => {
  var d = new Date(date)
  if (isYesterday(date)) {
    return '昨天'
  }
  if (isToday(date)) {
    return '今天'
  }
  if (isTomorrow(date)) {
    return '明天'
  }
  return weekDay(d.getDay())
}

/**
 * 截取数字小数位
 * @param value 数字
 * @param len  留取小数点后几位
 */
export const subNumber = (value: number, len: number): number => {
  return parseFloat(value.toFixed(len));
}

export const isString = (value: any): boolean => {
  return typeof value === "string";
}

export const isNumber = (value: any): boolean => {
  return typeof value === "number";
}
