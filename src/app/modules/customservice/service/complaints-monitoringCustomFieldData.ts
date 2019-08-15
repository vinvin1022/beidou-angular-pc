export const complaintsMonitoringCustomFieldData = {
  transactionPeriodic: {
    isShowTitle: true,
    allChecked: true,
    name: '投诉监控日报',
    children: [
      {
        label: '学院',
        value: 'snRate1',
        checked: true
      },
      {
        label: '负责人',
        value: 'snRate2',
        checked: true
      },
      {
        label: '新增投诉量',
        value: 'snRate3',
        checked: true
      },
      {
        label: '总投诉量',
        value: 'snRate4',
        checked: true
      },
      {
        label: '已关闭投诉量',
        value: 'snRate5',
        checked: true
      },
      {
        label: '投诉关闭率（%）',
        value: 'snRate5',
        checked: true
      },

      {
        label: '投诉强制移交量',
        value: 'snRate4',
        checked: true
      }
    ]
  },

  effectiveTimeNotClosed: {
    isShowTitle: true,
    allChecked: true,
    name: '有效时间段未关闭量',
    children: [
      {
        label: '倒计时72H',
        value: 'snRate1',
        checked: true
      },
      {
        label: '倒计时48H',
        value: 'snRate2',
        checked: true
      },
      {
        label: '倒计时24H',
        value: 'snRate3',
        checked: true
      }
    ]
  }
};
