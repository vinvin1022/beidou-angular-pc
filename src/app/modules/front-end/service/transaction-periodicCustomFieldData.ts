export const transactionPeriodicCustomFieldData = {
  transactionPeriodic: {
    isShowTitle: true,
    allChecked: true,
    name: '流水成交周期表',
    children: [
      {
        label: '当天截',
        value: 'snRate1',
        checked: true
      },
      {
        label: '隔日截',
        value: 'snRate2',
        checked: true
      },
      {
        label: '当周截（7日内）',
        value: 'snRate3',
        checked: true
      },
      {
        label: '上周截（7-14日）',
        value: 'snRate4',
        checked: true
      },
      {
        label: '其它',
        value: 'snRate5',
        checked: true
      }
    ]
  }
};
