export const dailyReachRateCustomFieldData = {
  transactionPeriodic: {
    isShowTitle: true,
    allChecked: true,
    showParentTitle: false,
    name: '每日触达率',
    children: [
      {
        label: '当日前置数',
        value: 'preTask',
        checked: true
      },
      {
        label: '已完成前置数',
        value: 'completePreTask',
        checked: true
      },
      {
        label: '当日工单发起总量',
        value: 'workNum',
        checked: true
      },
      {
        label: '已完成工单数量',
        value: 'completeWorkNum',
        checked: true
      },
      {
        label: '综合回访数量',
        value: 'returnTask',
        checked: true
      },

      {
        label: '已完成综合回访数量',
        value: 'completeReturnTask',
        checked: true
      },

      {
        label: '特殊回访量',
        value: 'specTask',
        checked: true
      },
      {
        label: '已完成特殊回访数量',
        value: 'completeSpecTask',
        checked: true
      },

      {
        label: '前置触达率（%)',
        value: 'rate1',
        checked: true
      },
      {
        label: '工单触达率(%)',
        value: 'rate2',
        checked: true
      },
      {
        label: '综合回访触达率(%)',
        value: 'rate3',
        checked: true
      },
      {
        label: '特殊回访触达率(%)',
        value: 'rate4',
        checked: true
      }
    ]
  }
};
