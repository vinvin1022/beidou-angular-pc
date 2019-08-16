/**
 * 格式化组织架构
 * @param temp Array
 */
export function changeJson(temp: Array<any> = []) {
  // 转换成多选nz-cascader格式
  const tempMenus = [];
  for (let i = 0; i < temp.length; i++) {
    tempMenus.push({});
    const menuItem = tempMenus[i];
    menuItem.label = temp[i].deptName;
    menuItem.value = temp[i].deptId;
    if (temp[i].childList && temp[i].childList.length) {
      menuItem.children = changeJson(temp[i].childList);
    } else {
      // menuItem.children = null;
      menuItem.isLeaf = true;
    }
  }
  return tempMenus;
}

/**
 * 格式化组织架构
 * @param temp Array
 */
export function changeJson2(temp: Array<any> = []) {
  // 转换成多选nz-cascader格式
  const tempMenus = [];
  for (let i = 0; i < temp.length; i++) {
    tempMenus.push({});
    const menuItem = tempMenus[i];
    menuItem.label = temp[i].deptName;
    menuItem.value = temp[i].deptId;
    menuItem.deptType = temp[i].deptType;
    menuItem.queryId = temp[i].deptId;

    if (temp[i].children && temp[i].children.length) {
      menuItem.children = changeJson2(temp[i].children);
    } else {
      // menuItem.children = null;
      menuItem.isLeaf = true;
    }
  }

  return tempMenus;
}


/**
 * @param temp 格式化组织架构
 * @param temp Array
 */
export function changeJson3(temp: Array<any> = []) {
  // 转换成多选nz-cascader格式
  const tempMenus = [];
  for (let i = 0; i < temp.length; i++) {
    tempMenus.push({});
    const menuItem = tempMenus[i];
    menuItem.label = temp[i].typeName;
    menuItem.value = temp[i].typeId;
    menuItem.typeCode = temp[i].typeCode;
    menuItem.typeId = temp[i].typeId;
    if (temp[i].children && temp[i].children.length) {
      menuItem.children = changeJson3(temp[i].children);
    } else {
      // menuItem.children = null;
      menuItem.isLeaf = true;
    }
  }

  return tempMenus;
}



// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
// (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
export function formatDate(date, fmt) {
  const nowDate = new Date(date);
  const o = {
    'M+': nowDate.getMonth() + 1,                 // 月份
    'd+': nowDate.getDate(),                    // 日
    'h+': nowDate.getHours(),                   // 小时
    'm+': nowDate.getMinutes(),                 // 分
    's+': nowDate.getSeconds(),                 // 秒
    'q+': Math.floor((nowDate.getMonth() + 3) / 3), // 季度
    'S': nowDate.getMilliseconds()             // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (nowDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }

  return fmt;
}

/**
 * 禁用当前以后的时间选择（包括当天）
 * @param current Date 日期当前时间
 */
export function rangePickerDisabledDate(current: Date): boolean {
  const currentTime = new Date(current).getTime();
  const today = new Date().getTime();
  const day = 24 * 3600 * 1000;
  return currentTime - today + day > 0;
}

/**
 * 禁用当前以后的时间选择(不包括当天)
 * @param current Date 日期当前时间
 */
export function rangePickerTodayDisabledDate(current: Date): boolean {
  const currentTime = new Date(current).getTime();
  const today = new Date().getTime();
  return currentTime - today > 0;
}

/**
 * 设置时间控件默认时间不包括(范围2周内)，周(范围3月内)，月(范围6月内)
 * @param value String 时间类型
 * @param isIncludeToday Boolean 是否包含当天  false包含当天
 */
export function setDefaultDate(value: string = 'period_wid', isIncludeToday = false) {
  const nowDate = new Date();
  const month = nowDate.getMonth();   // 获取月份

  const day = 24 * 3600 * 1000;

  let startTime;
  switch (value) {
    case 'period_wid':

      startTime = isIncludeToday ? new Date(nowDate.getTime() - day) : nowDate;
      break;
    case 'week_inyear':
      startTime = new Date(_setEndTime(7));
      break;
    case 'period_month':
      nowDate.setDate(1);
      startTime = nowDate;
      break;
    case 'period_qtr':
      for (let index = 3; index <= 12; index += 3) {
        if (month < index) {
          nowDate.setMonth(index - 3);
          break;
        }
      }
      nowDate.setDate(1);
      startTime = nowDate;
      break;
    case 'period_year':
      nowDate.setMonth(0);
      nowDate.setDate(1);
      startTime = nowDate;
      break;
    default:
      break;
  }
  return startTime;
}


/**
 * 专门为日(范围2周内)，周(范围3月内)，月(范围6月内) 设置默认时间
 * @param type 时间类型（日，周，月）
 */
export function setPurviewDefaultDate(type: string = 'period_wid') {
  let startTime;
  let endTime;
  const oneDay = 24 * 3600 * 1000;
  const nowTime = new Date();
  switch (type) {
    case 'period_wid':
      startTime = new Date(nowTime.setDate(nowTime.getDate() - 14));
      break;
    case 'week_inyear':
      startTime = new Date(nowTime.setMonth(nowTime.getMonth() - 3));
      break;
    case 'period_month':
      startTime = new Date(nowTime.setMonth(nowTime.getMonth() - 6));
      break;
  }
  endTime = new Date(new Date().getTime() - oneDay);
  return { startTime, endTime };
}

/**
 * 格式化 时分秒
 * @param timeStamp Number 时间戳
 * @returns string hh:mm:ss
 */
export function formattingTime(timeStamp): string {
  let t = '00:00:00';
  if (timeStamp > -1) {
    const hour = Math.floor(timeStamp / 3600);
    const min = Math.floor(timeStamp / 60) % 60;
    const sec = timeStamp % 60;
    if (hour < 10) {
      t = '0' + hour + ':';
    } else {
      t = hour + ':';
    }

    if (min < 10) { t += '0'; }
    t += min + ':';
    if (sec < 10) { t += '0'; }
    t += sec.toFixed(0);
  }
  return t;
}


/**
 * 格式化请求参数
 * @param filterData Object 需要请求的参数
 */
export function setFinalFilterData(filterData: object = {}) {
  const viewReportParams = {};
  for (const key in filterData) {
    if (filterData.hasOwnProperty(key)) {
      const element = filterData[key];
      if (element && Array.isArray(element) && element.length) {
        if (key === 'rangePicker') {
          if (element[0]) {
            viewReportParams['startTime'] = filterData['showTime'] ? formatDate(element[0], 'yyyy-MM-dd hh:mm') : formatDate(element[0], 'yyyy-MM-dd');
          }
          if (element[1]) {
            viewReportParams['endTime'] = filterData['showTime'] ? formatDate(element[1], 'yyyy-MM-dd hh:mm') : formatDate(element[1], 'yyyy-MM-dd');
          }
        } else if (key === 'accountUids' || key === 'siteNumbers') {
          const tmpArr = [];
          element.forEach((value) => { tmpArr.push(...(value.split(','))); });
          viewReportParams[key] = Array.from(new Set(tmpArr));
        } else {
          viewReportParams[key] = element;
        }
      } else if (element && typeof element === 'string') {
        if (key === 'advertisersTypeList') {
          if (element === '全部') {
            viewReportParams[key] = [];
          } else {
            viewReportParams[key] = [element];
          }
        } else {
          viewReportParams[key] = element;
        }

      } else if (element && (element instanceof Date)) {
        viewReportParams[key] = formatDate(element, 'yyyy-MM-dd');
      } else if (element) {
        viewReportParams[key] = element;
      }
    }
  }
  delete viewReportParams['showTime'];
  return viewReportParams;
}

/**
 * 是否为空对象
 * @param obj 参数
 */
export function _isEmptyObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}


/**
 * 加号转换为'%2B'
 * @param params object
 */
export function _reserveObject(params: object) {
  const newParams = { ...params };
  for (const key in newParams) {
    if (newParams.hasOwnProperty(key)) {
      if (Array.isArray(newParams[key])) {
        newParams[key] = newParams[key].map(item => {
          item = item.toString().replace(/\+/g, '%2B');
          return item;
        });
      } else if (typeof newParams[key] === 'string') {
        newParams[key] = newParams[key].replace(/\+/g, '%2B');
      }
    }
  }
  return newParams;
}


function _setEndTime(num) {
  const nowTimeDate = new Date();
  const time = nowTimeDate.getTime();
  const dayTime = 24 * 3600 * 1000;
  const day = nowTimeDate.getDay() === 0 ? num : nowTimeDate.getDay();
  const endvalue = time - (day * dayTime) + dayTime;
  return endvalue;
}
