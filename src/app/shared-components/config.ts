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
      default: [
        {
          "total_income": 6000,
          "total_expend": 275,
          "date": "2024-12-01"
        },
        {
          "total_income": 0,
          "total_expend": 225,
          "date": "2024-12-02"
        },
        {
          "total_income": 0,
          "total_expend": 840,
          "date": "2024-12-03"
        },
        {
          "total_income": 2000,
          "total_expend": 0,
          "date": "2024-12-04"
        }
      ],
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
      default: [
        {
          "expend_detail": [
            {
              "id": "2024-12-01_ex_3",
              "type": "expend",
              "category": "晚餐",
              "name": "健康餐",
              "data": 120,
              "commit": "",
              "update_time": "2024-12-01 21:00:00"
            },
            {
              "id": "2024-12-01_ex_2",
              "type": "expend",
              "category": "午餐",
              "name": "麻辣燙",
              "data": 90,
              "commit": "",
              "update_time": "2024-12-01 21:00:00"
            }
          ],
          "date": "2024-12-01"
        },
        {
          "expend_detail": [
            {
              "id": "2024-12-02_ex_2",
              "type": "expend",
              "category": "社交",
              "name": "聚餐",
              "data": 450,
              "commit": "",
              "update_time": "2024-12-02 22:00:00"
            },
            {
              "id": "2024-12-02_ex_1",
              "type": "expend",
              "category": "日用品",
              "name": "牙刷",
              "data": 135,
              "commit": "",
              "update_time": "2024-12-02 22:00:00"
            }
          ],
          "date": "2024-12-02"
        },
        {
          "expend_detail": [
            {
              "id": "2024-12-03_ex_4",
              "type": "expend",
              "category": "社交",
              "name": "朋友的生日禮物",
              "data": 500,
              "commit": "",
              "update_time": "2024-12-03 21:00:00"
            },
            {
              "id": "2024-12-03_ex_1",
              "type": "expend",
              "category": "午餐",
              "name": "火鍋",
              "data": 160,
              "commit": "",
              "update_time": "2024-12-03 21:00:00"
            }
          ],
          "date": "2024-12-03"
        },
        {
          "total_income": 2000,
          "total_expend": 0,
          "income_detail": [
            {
              "id": "2024-12-04_in_1",
              "type": "income",
              "category": "投資",
              "name": "股票",
              "data": 2000,
              "commit": "",
              "update_time": "2024-12-04 23:00:00"
            }
          ],
          "expend_detail": [],
          "date": "2024-12-04"
        }
      ]
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

