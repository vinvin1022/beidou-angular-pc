export const frontRealReportCustomFieldData = {
  frontRealReport: {
    isShowTitle: true,
    allChecked: true,
    name: '实时监控',
    children: [
      {
        label: '流水',
        value: 'ordersAmo',
        checked: true,
        nzShowSort: true,
        nzSortKey: 'orders_amo'
      },
      {
        label: '预约单',
        value: 'expOrderDay',
        checked: true
      },
      {
        label: '到访单',
        value: 'visitAco',
        checked: true
      },
      {
        label: '报名率(%)',
        value: 'orderRate1',
        checked: true
      },
      {
        label: '报名数',
        value: 'ordersAco',
        checked: true
      },
      {
        label: '总业绩',
        value: 'ordersAmo',
        checked: true
      },
      {
        label: '首咨分配数',
        value: 'firstAllotdAco',
        checked: true
      },


      {
        label: '分校报名',
        value: 'ordersAmo2',
        checked: true
      },
      {
        label: '线上录单流水',
        value: 'ordersAmo1',
        checked: true
      },

      {
        label: '电审',
        value: 'sn5',
        checked: true
      },
      {
        label: '首付',
        value: 'sn2',
        checked: true
      },
      {
        label: '未支付',
        value: 'sn1',
        checked: true
      },




      {
        label: 'ARPU',
        value: 'orderRate2',
        checked: true
      },
      {
        label: '分配时效',
        value: 'timediffAlFla',
        checked: true
      },

      {
        label: '拨打时效',
        value: 'firstTimediffAlCala',
        checked: true
      },
      {
        label: '服务时效(网销)',
        value: 'timediffAl2Fla',
        checked: true
      },
      {
        label: '通话次数',
        value: 'callAco',
        checked: true
      },
      {
        label: '通话时长',
        value: 'calLongTimea',
        checked: true,
        nzShowSort: true,
        nzSortKey: 'cal_long_time'
      },
      {
        label: '有效通话次数',
        value: 'effcallAco',
        checked: true,
        nzShowSort: true,
        nzSortKey: 'effcall_aco'
      },
      {
        label: '销机',
        value: 'effordersAcoFlow',
        checked: true
      },
      {
        label: '有效性(%)',
        value: 'effRate1',
        checked: true
      },
      {
        label: '首咨接通率(%)',
        value: 'firstCaRate',
        checked: true
      }
    ]
  },
  callsDuring: {
    isShowTitle: true,
    allChecked: true,
    name: '时段通话数',
    children: [
      {
        label: '0<X<=20秒',
        value: 'callAco1',
        checked: true,
      },
      {
        label: '20秒<X<=1分钟',
        value: 'callAco2',
        checked: true
      },
      {
        label: '1分钟<X<=5分钟',
        value: 'callAco3',
        checked: true
      },
      {
        label: '5分钟<X<=10分钟',
        value: 'callAco4',
        checked: true
      },
      {
        label: '10分钟<X<=15分钟',
        value: 'callAco5',
        checked: true
      },
      {
        label: '15分钟<X<=20分钟',
        value: 'callAco6',
        checked: true
      },
      {
        label: 'X>20分钟',
        value: 'callAco7',
        checked: true
      }
    ]
  }
};
