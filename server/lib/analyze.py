# -*- coding: utf-8 -*-
import os
import pandas as pd
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from ..utils import responses as resp
from ..utils.responses import response_with
# from ..utils.sql_build import sql_insert, sql_update, sql_delete, sql_select
from ..utils.database import db


# 當月剩餘預算
def remain_budget():
    df = pd.read_sql('upload_bg_data', con=db.engine)
    res = {
        'value': 2000,
        'percent': 15
    }
    return response_with(resp.SUCCESS_200, value={"data": res})


# 總收入/總支出/總結餘
def total(request):
    data = request.get_json()
    res = {
        'income': 40000,
        'expend': 15000,
        'remain': 30000
    }
    return response_with(resp.SUCCESS_200, value={"data": res})


# 收入/支出排名
def rank(request):
    data = request.get_json()
    res = {
        'income': [
            {
                "category": "薪水",
                "value": 10000,
                "percent": 0.6
            },
            {
                "category": "獎金",
                "value": 6500,
                "percent": 0.4
            },
            {
                "category": "投資",
                "value": 2000,
                "percent": 0.2
            }
        ],
        'expend': [
            {
                "category": "日用品",
                "value": 1500,
                "percent": 0.6
            },
            {
                "category": "午餐",
                "value": 1065,
                "percent": 0.4
            },
            {
                "category": "社交",
                "value": 750,
                "percent": 0.2
            }
        ],
    }
    return response_with(resp.SUCCESS_200, value={"data": res})


# 每日總收入/支出資料
def each_date_total(request):
    data = request.get_json()
    res = {
        '2024-03-01': {
            "income": 0,
            "expend": 200,
        },
        '2024-03-02': {
            "income": 0,
            "expend": 200,
        },
        '2024-03-04': {
            "income": 1000,
            "expend": 200,
        },
        '2024-03-09': {
            "income": 0,
            "expend": 200,
        },
    }
    return response_with(resp.SUCCESS_200, value={"data": res})


# 每日支出前兩名
def each_date_rank(request):
    data = request.get_json()
    res = {
        '2024-03-01': [
            {
                "category": "日用品",
                "value": 550
            },
            {
                "category": "醫療",
                "value": 200
            }
        ],
        '2024-03-02': [
            {
                "category": "午餐",
                "value": 250
            }
        ]
    }
    return response_with(resp.SUCCESS_200, value={"data": res})


# 詳細品項排名
def detail_rank(request):
    data = request.get_json()
    res = {
        "捷運": 4,
        "下午茶": 2,
        "咖啡": 1
    }
    return response_with(resp.SUCCESS_200, value={"data": res})
