import { Injectable } from '@angular/core';
import { formattingTime, _isEmptyObject } from 'src/app/tools';

@Injectable({
  providedIn: 'root'
})
export class TableTreeService {
  constructor() { }

  /**
   * 格式化数据 添加% 格式化时间hh:mm:ss
   * @param obj object
   * @param percentage  Array<string>  添加%字段
   * @param formatTime Array<string> 格式化时间字段
   * @returns object
   */
  private addPercentageFormatTime(obj, percentage: string[], formatTime: string[]) {
    const inobj = { ...obj };
    for (const key in inobj) {
      if (inobj.hasOwnProperty(key)) {
        if ((inobj[key] || inobj[key] === 0) && percentage.includes(key)) {
          inobj[key] = inobj[key] + '%';
        }

        if ((inobj[key] || inobj[key] === 0) && formatTime.includes(key)) {
          inobj[key] = formattingTime(inobj[key]);
        }
      }
    }
    return inobj;
  }

  private visitNode(node, hashMap: object, array): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }


  /**
   * 展开表格树形操作
   * @param array
   * @param data object 当前行数据
   * @param $event boolean 是否展开标识
   */
  collapse(array: Array<any>, data: object, $event: boolean): void {
    if ($event === false) {
      if (data['children']) {
        data['children'].forEach(d => {
          const target = array.find(a => a.key === d.key);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }


  /**
   * 格式化数据
   * @param root 当前行数据
   * @param plusPercentage Array<string>  添加%字段
   * @param formatTime Array<string> 格式化时间字段
   * @returns array
   */
  convertTreeToList(root: object, plusPercentage: Array<string> = [], formatTime: Array<string> = [], expand = false) {
    const stack = [];
    const array = [];
    const hashMap = {};
    const inroot = this.addPercentageFormatTime(root, plusPercentage, formatTime);    // 添加某些字段%
    stack.push({ ...inroot, level: 0, expand: expand });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          const inchildren = this.addPercentageFormatTime(node.children[i], plusPercentage, formatTime); // 添加某些字段%
          stack.push({ ...inchildren, level: node.level + 1, expand: expand, parent: node });
        }
      }
    }
    return array;
  }


  /**
   * 重新组装报表树形结构
   * @param data object
   * @param expandDataCache object
   */
  formateTableTree(data: object, expandDataCache: object = {}): object {
    const newExpandDataCache = { ...expandDataCache };
    if (data && !_isEmptyObject(data)) {
      let parent = data['parent'] || data;
      while (parent && parent['level'] !== 0) {
        parent = parent['parent'];
      }
      newExpandDataCache[parent['key']].map((item) => {
        this._expandTrue(item, data);
        return item;
      });
    }
    return newExpandDataCache;
  }



  private _expandTrue(litem, rdata) {
    if (litem['key'] === rdata['key']) {
      litem['expand'] = true;
    }
    if (rdata['parent']) {
      this._expandTrue(litem, rdata['parent']);
    }
  }

  /**
   * 存在extChild 添加chidren树形
   * @param data
   */
  createTableTreeChildren(data: Array<any> = []) {
    const newData = [...data];
    newData.map(item => {
      if (item.extChild) {
        item.children = [];
      }
      return item;
    });
    return newData;
  }

  /**
   * 组装数据children属性
   * @param tableTreeData
   * @param data object 当前行数据
   * @param result Array 请求返回结果数据
   */
  assemblyChildren(tableTreeData: Array<any> = [], data: object = {}, result: Array<any> = []) {
    const newTableTreeData = [...tableTreeData];
    switch (data['level']) {
      case 0:
        newTableTreeData.map(item => {
          if (item['key'] === data['key']) {
            item.children = this.createTableTreeChildren(result);
          }
          return item;
        });
        break;
      case 1:
        newTableTreeData.map(item => {
          if (item['key'] === data['parent']['key']) {
            item.children.map(sitem => {
              if (sitem['key'] === data['key']) {
                sitem.children = this.createTableTreeChildren(result);
              }
              return sitem;
            });
          }
          return item;
        });
        break;
      case 2:
        newTableTreeData.map(item => {
          if (item['key'] === data['parent']['parent']['key']) {
            item.children.map(sitem => {
              if (sitem['key'] === data['parent']['key']) {
                sitem.children.map(witem => {
                  if (witem['key'] === data['key']) {
                    witem.children = this.createTableTreeChildren(result);
                    return witem;
                  }
                });
              }
              return sitem;
            });
          }
          return item;
        });
        break;

      case 3:
        newTableTreeData.map(item => {
          if (item['key'] === data['parent']['parent']['parent']['key']) {
            item.children.map(zitem => {
              if (zitem['key'] === data['parent']['parent']['key']) {
                zitem.children.map(sitem => {
                  if (sitem['key'] === data['parent']['key']) {
                    sitem.children.map(witem => {
                      if (witem['key'] === data['key']) {
                        witem.children = this.createTableTreeChildren(result);
                        return witem;
                      }
                    });
                  }
                  return sitem;
                });
              }
              return zitem;
            });
          }
          return item;
        });
        break;

      default:
        break;
    }
    return newTableTreeData;
  }


  private _getParent(data) {
    let p = data['parent'] || data;
    while (p['level'] !== 0) {
      p = p['parent'];
    }
    return p;
  }


  /**
   * 获取每一层的key value
   * @param data object
   */
  _getdlist(data: object = {}): {listValue: Array<string>, listDimension: Array<string>} {
    const listValue = [];
    const listDimension = [];
    let px = { ...data['parent'] };
    while (px && px['userId']) {
      listValue.push(px['userId']);
      listDimension.push(px['dimesionKey']);
      px = px['parent'];
    }
    return { listValue, listDimension };
  }
}
