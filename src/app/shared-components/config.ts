// 元件列表
export const analyze = [
  {
    id: 4,
    size: '1x1',
    type: 'water',
    page: 'analyze',
    name: '當月剩餘預算',
    tips: '',
    data: {
      default: 50
    }
  },
  {
    id: 1,
    size: '1x1',
    type: 'value',
    page: 'analyze',
    name: '總收入',
    tips: '',
    data: {
      default: 10000
    }
  },
  {
    id: 2,
    size: '1x1',
    type: 'value',
    page: 'analyze',
    name: '總支出',
    tips: '',
    data: {
      default: 8000
    }
  },
  {
    id: 3,
    size: '1x1',
    type: 'value',
    page: 'analyze',
    name: '總結餘',
    tips: '',
    data: {
      default: 2000
    }
  },
  {
    id: 5,
    size: '1x1',
    type: 'rankingForm',
    page: 'analyze',
    name: '詳細品項排名',
    tips: '',
    data: {
      default: [
        {
          "item": "咖啡",
          "value": 6
        },
        {
          "item": "巧克力",
          "value": 4
        },
        {
          "item": "健康餐",
          "value": 2
        },
        {
          "item": "咖啡",
          "value": 1
        },
        {
          "item": "公車",
          "value": 1
        },
      ]
    }
  },
  {
    id: 6,
    size: '1x1',
    type: 'dataStatistics',
    page: 'analyze',
    name: '資料缺失統計',
    tips: '',
    data: {
      default: [30, 25, 5]
    }
  },
  {
    id: 7,
    size: '2x1',
    type: 'timeLine',
    page: 'analyze',
    name: '每日收入與支出分析',
    tips: '',
    data: {
      default: {
        "2025-04-01": {
          "income": 0,
          "expend": 1784
        },
        "2025-04-02": {
          "income": 49021,
          "expend": 320
        },
        "2025-04-03": {
          "income": 0,
          "expend": 595
        },
        "2025-04-04": {
          "income": 0,
          "expend": 99
        },
      }
    }
  },
  {
    id: 8,
    size: '2x1',
    type: 'timeBar',
    page: 'analyze',
    name: '每日花費前兩名品項',
    tips: '',
    data: {
      default: {
        "2025-04-01": {
          "社交": 1589,
          "午餐": 130,
          "飲品": 35,
          "交通": 30
        },
        "2025-04-02": {
          "社交": 170,
          "飲品": 70,
          "午餐": 50,
          "交通": 30
        },
        "2025-04-03": {
          "午餐": 230,
          "飲品": 195,
          "家裡": 170
        },
        "2025-04-04": {
          "午餐": 99
        }
      }
    }
  },
  {
    id: 9,
    size: '2x1',
    type: 'pieChart',
    page: 'analyze',
    name: '各分類收入',
    tips: '',
    data: {
      default: [
        {
          "category": "獎金",
          "value": 6000
        },
        {
          "category": "投資",
          "value": 2000
        }
      ]
    }
  },
  {
    id: 10,
    size: '2x1',
    type: 'pieChart',
    page: 'analyze',
    name: '各分類支出',
    tips: '',
    data: {
      default: [
        {
          "category": "社交",
          "value": 950
        },
        {
          "category": "午餐",
          "value": 250
        },
        {
          "category": "晚餐",
          "value": 240
        },
        {
          "category": "日用品",
          "value": 135
        },
        {
          "category": "交通",
          "value": 90
        },
        {
          "category": "飲品",
          "value": 35
        }
      ]
    }
  },
  {
    id: 11,
    size: '1x2',
    type: 'barRanking',
    page: 'analyze',
    name: '收入排名',
    tips: '',
    data: {
      default: [
        {
          "category": "獎金",
          "value": 6000,
          "width": 100,
          "dataColor": "#F06449",
          "fullColor": "#FCDFD9"
        },
        {
          "category": "投資",
          "value": 2000,
          "width": 33.333333333333336,
          "dataColor": "#61C9A8",
          "fullColor": "#DDF3EC"
        }
      ]
    }
  },
  {
    id: 12,
    size: '1x2',
    type: 'barRanking',
    page: 'analyze',
    name: '支出排名',
    tips: '',
    data: {
      default: [
        {
          "category": "社交",
          "value": 950,
          "width": 100,
          "dataColor": "#F06449",
          "fullColor": "#FCDFD9"
        },
        {
          "category": "午餐",
          "value": 250,
          "width": 26.31578947368421,
          "dataColor": "#61C9A8",
          "fullColor": "#DDF3EC"
        },
        {
          "category": "晚餐",
          "value": 240,
          "width": 25.263157894736842,
          "dataColor": "#61C9A8",
          "fullColor": "#DDF3EC"
        },
        {
          "category": "日用品",
          "value": 135,
          "width": 14.210526315789474,
          "dataColor": "#61C9A8",
          "fullColor": "#DDF3EC"
        },
        {
          "category": "交通",
          "value": 90,
          "width": 9.473684210526315,
          "dataColor": "#61C9A8",
          "fullColor": "#DDF3EC"
        },
        {
          "category": "飲品",
          "value": 35,
          "width": 3.6842105263157894,
          "dataColor": "#61C9A8",
          "fullColor": "#DDF3EC"
        }
      ]
    }
  },
]

