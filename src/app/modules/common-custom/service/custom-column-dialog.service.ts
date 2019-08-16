import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { Observable } from 'rxjs';
import { _isEmptyObject } from 'src/app/tools';
@Injectable()
export class CustomColumnDialogService {
  public columnData: object = {};
  constructor(private request: RequestService) { }



  /**
   * 获取自定义列菜单信息
   * @param params object  请求参数
   */
  getMenu(params?: object) {
    return this.request.post('dms/costomMenu/getMenu', params);
  }
  /**
   * 保存菜单信息
   */
  saveMenu(params?: object): Observable<any> {
    return this.request.post('dms/costomMenu/saveMenu', params);
  }


  /**
   * 重新生成对象 防止对象引用问题
   * @param customColumnData object
   */
  resetColumnData(customColumnData) {
    const tmpObj = {};
    for (const pkey in customColumnData) {
      if (customColumnData.hasOwnProperty(pkey)) {
        const pelement = customColumnData[pkey];
        tmpObj[pkey] = {};
        for (const mkey in pelement) {
          if (pelement.hasOwnProperty(mkey)) {
            const melement = pelement[mkey];
            if (mkey !== 'children') {
              tmpObj[pkey][mkey] = melement;
            } else {
              const tmpArr = [];
              melement.forEach(item => {
                tmpArr.push({ ...item });
              });
              tmpObj[pkey][mkey] = tmpArr;
            }
          }
        }
      }
    }
    return tmpObj;
  }


  /**
   * 重新赋值表格字段
   * @param customColumnData object
   * @param customMenu object
   */
  shaiXuanSelected(customColumnData: object, customMenu: object) {
    if (_isEmptyObject(customMenu)) {
      return { ...customColumnData };
    }
    for (const key in customMenu) {
      if (customMenu.hasOwnProperty(key)) {
        for (const skey in customColumnData) {
          if (customColumnData.hasOwnProperty(key)) {
            const selement = customColumnData[skey];
            if (key === skey) {
              for (const zkey in selement) {
                if (selement.hasOwnProperty(zkey)) {
                  if (zkey !== 'children') {
                    customColumnData[skey][zkey] = customMenu[skey][zkey];
                  } else {
                    // if (customMenu[skey][zkey].length) {
                    customColumnData[skey][zkey].map(item => {
                      item['checked'] = false;
                      return item;
                    });
                    customMenu[skey][zkey].forEach(sitem => {
                      const index = customColumnData[skey][zkey].findIndex((item) => {
                        return sitem['value'] === item['value'] && sitem['checked'];
                      });
                      customColumnData[skey][zkey][index] = sitem;
                    });
                    // }
                  }
                }
              }
            }
          }
        }
      }
    }
    return { ...customColumnData };
  }



  /**
   * @param customColumnData object 筛选选中字段
   */
  filterSelectColoumn(customColumnData: object) {
    const selectField = {};
    const allChildren = [];
    for (const pkey in customColumnData) {
      if (customColumnData.hasOwnProperty(pkey)) {
        const pelement = customColumnData[pkey];
        selectField[pkey] = {};
        for (const mkey in pelement) {
          if (pelement.hasOwnProperty(mkey)) {
            const melement = pelement[mkey];
            if (mkey !== 'children') {
              selectField[pkey][mkey] = melement;
            } else {
              const newChildren = melement.filter(item => item.checked);
              selectField[pkey][mkey] = newChildren;
              allChildren.push(...newChildren);
            }
          }
        }
      }
    }

    return { selectField, allChildren };
  }



  /**
   * 删除空属性
   * @param customColumnData object
   */
  deleteProto(customColumnData) {
    for (const key in customColumnData) {
      if (customColumnData.hasOwnProperty(key)) {
        const element = customColumnData[key];
        if (!element.children || !element.children.length) {
          delete customColumnData[key];
        } else {
          const checked = element.children.find(item => !item['checked']);
          const ischecked = element.children.find(item => item['checked']);
          customColumnData[key]['indeterminate'] = true;
          if (checked) {
            customColumnData[key]['indeterminate'] = ischecked ? true : false;
            customColumnData[key]['allChecked'] = false;
          } else {
            customColumnData[key]['indeterminate'] = false;
            customColumnData[key]['allChecked'] = true;
          }
        }
      }
    }
    return customColumnData || {};
  }

}
