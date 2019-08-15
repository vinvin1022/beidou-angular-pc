export const menuJson: Array<object> = [
  // 首页
  {
    menuName: '首页',
    full_menuName: '首页',
    id: 'I_13',
    isOpen: false,
    menuIcon: '&#xe604;',
    enName: 'home',
    menuUrl: '/home',
  },
  // 业绩总览
  {
    menuName: '总览',
    full_menuName: '总览',
    id: 'I_14',
    isOpen: false,
    menuIcon: '&#xe601;',
    enName: 'summaryperformance',
    menuUrl: '/summaryperformance',
    children: [
      {
        menuName: '业绩总览',
        full_menuName: '业绩总览',
        id: 'I_14/M_0/T_0',
        enName: 'goodresults',
        menuUrl: '/summaryperformance/goodresults',
      },
      {
        menuName: '实时战报',
        full_menuName: '实时战报',
        id: 'I_14/M_0/T_1',
        enName: 'timeWarReport',
        menuUrl: '/summaryperformance/timeWarReport',
      },
      {
        id: 'I_14/M_0/T_2',
        menuName: '名片实时概况',
        detailSelected: false,
        enName: 'situationOfBusiness',
        menuUrl: '/summaryperformance/situationOfBusiness'
      },
    ]
  },
  // 流量
  {
    menuName: '流量',
    full_menuName: '流量管理',
    id: 'I_15',
    isOpen: false,
    menuIcon: '&#xe607;',
    menuUrl: '/flow',
    enName: 'flow',
    children: [
      {
        id: 'I_15/M_0/T_0',
        menuName: '推广总览',
        detailSelected: false,
        enName: 'generalIntroduction',
        menuUrl: '/flow/generalIntroduction'
      },
      {
        id: 'I_15/M_0/T_6',
        menuName: '推广总览',
        detailSelected: false,
        enName: 'generalIntroductionA',
        menuUrl: '/flow/generalIntroductionA'
      },
      {
        id: 'I_15/M_0/T_1',
        menuName: '推广指标',
        detailSelected: false,
        enName: 'extensionIndex',
        menuUrl: '/flow/extensionIndex'
      },
      {
        id: 'I_15/M_0/T_2',
        menuName: '销售指标',
        detailSelected: false,
        enName: 'salesTarget',
        menuUrl: '/flow/salesTarget'
      },
      {
        id: 'I_15/M_0/T_3',
        menuName: '投放监控',
        detailSelected: false,
        enName: 'releaseMonitoring',
        menuUrl: '/flow/releaseMonitoring'
      },
      {
        id: 'I_15/M_0/T_4',
        menuName: '在线统计',
        detailSelected: false,
        enName: 'onlineStatistics',
        menuUrl: '/flow/onlineStatistics'
      },
      {
        id: 'I_15/M_0/T_5',
        menuName: '展点消导出',
        detailSelected: false,
        enName: 'expansionDerivation',
        menuUrl: '/flow/expansionDerivation'
      },
      {
        id: 'I_15/M_0/T_6',
        menuName: '实时监控',
        detailSelected: false,
        enName: 'trafficRealTimeReport',
        menuUrl: '/flow/trafficRealTimeReport'
      },

    ]
  },

  // 系统
  {
    menuName: '系统',
    full_menuName: '系统',
    id: 'I_19',
    isOpen: false,
    menuIcon: '&#xe601;',
    enName: 'system',
    children: [
      {
        menuName: '设置中心',
        full_menuName: '设置中心',
        id: 'I_19/M_0/T_0',
        isOpen: false,
        menuIcon: '&#xe601;',
        enName: 'settingCenter',
        menuUrl: '/system/settingCenter'
      },
      {
        menuName: '指标权限',
        full_menuName: '指标权限',
        id: 'I_19/M_0/T_1',
        isOpen: false,
        menuIcon: '&#xe601;',
        enName: 'setMetricsPermission ',
        menuUrl: '/system/setMetricsPermission'
      },
      {
        menuName: '权限管理',
        full_menuName: '权限管理',
        id: 'I_19/M_0/T_2',
        isOpen: false,
        menuIcon: '&#xe601;',
        enName: 'authorityManagement ',
        menuUrl: '/system/authorityManagement'
      }
    ]
  },

  // 前端
  {
    menuName: '前端',
    full_menuName: '前端管理',
    id: 'I_16',
    isOpen: false,
    menuIcon: '&#xe606;',
    menuUrl: '/frontend',
    enName: 'frontend',
    children: [
      {
        id: 'I_16/M_0/T_0',
        menuName: '网销效率指标统计',
        detailSelected: false,
        enName: 'netIndex',
        menuUrl: '/frontend/netIndex'
      },
      {
        id: 'I_16/M_0/T_1',
        menuName: '网销项目指标统计',
        detailSelected: false,
        enName: 'netStatistics',
        menuUrl: '/frontend/netStatistics'
      },
      {
        id: 'I_16/M_1/T_2',
        menuName: '电销效率指标统计',
        detailSelected: false,
        enName: 'electricControl',
        menuUrl: '/frontend/electricControl'
      },
      {
        id: 'I_16/M_1/T_3',
        menuName: '电销项目指标统计',
        detailSelected: false,
        enName: 'electricStatistics',
        menuUrl: '/frontend/electricStatistics'
      },
      {
        id: 'I_16/M_1/T_4',
        menuName: '中端军团数据分析',
        enName: 'armyDataAnalysis',
        menuUrl: '/frontend/armyDataAnalysis'
      },
      {
        id: 'I_16/M_1/T_5',
        menuName: '中端军团流量分析',
        enName: 'armyFlowAnalysis',
        menuUrl: '/frontend/armyFlowAnalysis'
      },
      {
        id: 'I_16/M_1/T_6',
        menuName: '实时监控',
        enName: 'frontEndRealTimeReport',
        menuUrl: '/frontend/frontEndRealTimeReport'
      },
      {
        id: 'I_16/M_0/T_7',
        menuName: '孵化项目效率',
        enName: 'incubationProject ',
        menuUrl: '/frontend/incubationProject'
      },

      {
        id: 'I_16/M_0/T_8',
        menuName: '流水成交周期表',
        enName: 'flowTransactionPeriodic ',
        menuUrl: '/frontend/flowTransactionPeriodic'
      },
      {
        id: 'I_16/M_0/T_9',
        menuName: '销售业绩表',
        enName: 'salesPerformance',
        menuUrl: '/frontend/salesPerformance'
      },
    ]
  },
  // 中端
  // {
  //   menuName: '中端',
  //   full_menuName: '中端',
  //   id: 'I_17',
  //   isOpen: false,
  //   menuIcon: '&#xe605;',
  //   enName: 'middleend',
  //   menuUrl: '/middleend',
  //   children: [
  //     {
  //       id: 'I_17/M_0/T_0',
  //       menuName: '军团数据分析',
  //       enName: 'armyDataAnalysis',
  //       menuUrl: '/middleend/armyDataAnalysis'
  //     },
  //     {
  //       id: 'I_17/M_0/T_1',
  //       menuName: '军团流量分析',
  //       enName: 'armyFlowAnalysis',
  //       menuUrl: '/middleend/armyFlowAnalysis'
  //     }
  //   ]
  // },

  // 后端
  {
    menuName: '后端',
    full_menuName: '后端',
    id: 'I_18',
    isOpen: false,
    menuIcon: '&#xe602;',
    enName: 'rearend',
    menuUrl: '/rearend',
    children: [
      {
        id: 'I_18/M_0/T_0',
        menuName: '自营业绩',
        enName: 'selfEmployedPerformance',
        menuUrl: '/rearend/selfEmployedPerformance'
      },
      {
        id: 'I_18/M_0/T_1',
        menuName: '每日通时',
        enName: 'dailyHours',
        menuUrl: '/rearend/dailyHours'
      },
      {
        id: 'I_18/M_0/T_2',
        menuName: '实时监控',
        enName: 'rearendRealTimeReport',
        menuUrl: '/rearend/rearendRealTimeReport'
      },
      {
        id: 'I_18/M_0/T_3',
        menuName: '升班业绩',
        enName: 'promotionPerformance',
        menuUrl: '/rearend/promotionPerformance'
      },


      {
        id: 'I_18/M_0/T_4',
        menuName: '每日触达率',
        enName: 'dailyReachRate',
        menuUrl: '/rearend/dailyReachRate'
      },
      {
        id: 'I_18/M_0/T_5',
        menuName: '每日工单报表',
        enName: 'dailyWorkOrderReport',
        menuUrl: '/rearend/dailyWorkOrderReport'
      },
      {
        id: 'I_18/M_0/T_6',
        menuName: '服务期任务统计表',
        enName: 'tasksDuringService ',
        menuUrl: '/rearend/tasksDuringService'
      },
      {
        id: 'I_18/M_0/T_7',
        menuName: '班型数据概况',
        enName: 'overviewClassData',
        menuUrl: '/rearend/overviewClassData'
      }
    ]
  },

  // 客服&投诉
  {
    menuName: '客服&投诉',
    full_menuName: '客服&投诉',
    id: 'I_19',
    isOpen: false,
    menuIcon: '&#xe605;',
    enName: 'customservice',
    menuUrl: '/customservice',
    children: [
      {
        id: 'I_19/M_0/T_0',
        menuName: '每日退学早报',
        enName: 'dropoutMorningNewspaper',
        menuUrl: '/customservice/dropoutMorningNewspaper'
      },
      {
        id: 'I_19/M_0/T_1',
        menuName: '投诉监控日报',
        enName: 'complaintsMonitoring',
        menuUrl: '/customservice/complaintsMonitoring'
      },
      {
        id: 'I_19/M_0/T_2',
        menuName: '业务办理汇总表',
        enName: 'businessProcessing',
        menuUrl: '/customservice/businessProcessing'
      },
    ]
  },

  // 首页测试
  {
    menuName: '首页测试',
    full_menuName: '首页测试',
    id: 'I_20',
    isOpen: false,
    menuIcon: '&#xe604;',
    enName: 'hometest',
    menuUrl: '/hometest',
  },
];
