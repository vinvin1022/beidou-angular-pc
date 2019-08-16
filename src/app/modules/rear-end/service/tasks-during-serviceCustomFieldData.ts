export const tasksDuringServiceCustomFieldData = {
  transactionPeriodic: {
    isShowTitle: true,
    allChecked: true,
    name: '服务期任务统计表',
    children: [
      {
        label: '总前置任务量',
        value: 'preTask',
        checked: true
      },
      {
        label: '已经完成前置量',
        value: 'completePreTask',
        checked: true
      },
      {
        label: '有效电话前置量',
        value: 'effecPreTask',
        checked: true
      },
      {
        label: '未完成前置量',
        value: 'uncompletePreTask',
        checked: true
      },
      {
        label: '服务期其他任务量',
        value: 'otherTask',
        checked: true
      },


      {
        label: '服务期其他任务完成量',
        value: 'completeOtherTask',
        checked: true
      },
      {
        label: '服务期其他任务量完成度(%)',
        value: 'rate1',
        checked: true
      },
      {
        label: '平均前置时效',
        value: 'completePreTime',
        checked: true
      }
    ]
  }
};
