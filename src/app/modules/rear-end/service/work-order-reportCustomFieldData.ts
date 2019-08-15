export const workOrderReportCustomFieldData = {
  transactionPeriodic: {
    isShowTitle: true,
    allChecked: true,
    name: '每日工单表',
    children: [
      {
        label: '工单发起总量（含退学）',
        value: 'workNum',
        checked: true
      },
      {
        label: '未处理工单量',
        value: 'unhandleWorkNum',
        checked: true
      },
      {
        label: '已跟进工单数量',
        value: 'handleWorkNum',
        checked: true
      },
      {
        label: '工单跟进率',
        value: 'rate1',
        checked: true
      },
      {
        label: '退学发起总量',
        value: 'dropWorkNum',
        checked: true
      },
      {
        label: '报名24小时内',
        value: 'oderNum1',
        checked: true
      },
      {
        label: '报名7天非24小时内',
        value: 'oderNum7',
        checked: true
      },
      {
        label: '报名1个月内',
        value: 'oderNum30',
        checked: true
      },
      {
        label: '报名3个月内',
        value: 'oderNum90',
        checked: true
      },
      {
        label: '报名3个月外',
        value: 'oderNumOther',
        checked: true
      },
      {
        label: '工单首次跟进时效',
        value: 'workCompStartTime',
        checked: true
      },
      {
        label: '移交退学组数量',
        value: 'transWorkNum',
        checked: true
      }
    ]
  }
};
