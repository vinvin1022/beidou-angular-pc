import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { FlowcommonformService } from './flowcommonform.service';

@Injectable({
  providedIn: 'root'
})
export class FlowService {
  constructor(private flowcommonformService: FlowcommonformService) { }


 /**
   * 维度数据映射
   */
  yingshe(list, filterData = {}) {
    const { flConsultingProjectOptions, siteNumberOptions, webUidOptions,
      codeOptions, sourceOptions, carrierOptions  } = this.flowcommonformService;
    const oys = [
      {queryDimension: 'fl_consulting_project', relatively: 'optionId', downOption: flConsultingProjectOptions, returnkey: 'optionName'},
      {queryDimension: 'site_number', relatively: 'optionId', downOption: siteNumberOptions, returnkey: 'optionName'},
      {queryDimension: 'web_uid', relatively: 'optionId', downOption: webUidOptions, returnkey: 'optionName'},
      {queryDimension: 'code', relatively: 'optionId', downOption: codeOptions, returnkey: 'optionName'},
      {queryDimension: 'source', relatively: 'optionId', downOption: sourceOptions, returnkey: 'optionName'},
      {queryDimension: 'carrier', relatively: 'optionId', downOption: carrierOptions, returnkey: 'optionName'},
    ];
    const newlist = list.map((value) => {
      for (let oidx = 0; oidx < oys.length; oidx++) {
        const ositem = oys[oidx];
        if (filterData['queryDimension'] === ositem['queryDimension']) {
          if (ositem['downOption'] && ositem['downOption'].length) {
            for (let index = 0; index < ositem['downOption'].length; index++) {
              const element = ositem['downOption'][index];
              if ((value['dimension'] === element[ositem['relatively']] + '')
              || (value['queryDimension'] === element[ositem['relatively']] + '')) {
                value['dimensionName'] = element[ositem['returnkey']];
              }
            }
          }
        }
      }
      return value;
    });
    return newlist;
   }
}
