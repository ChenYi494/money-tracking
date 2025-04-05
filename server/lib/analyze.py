# -*- coding: utf-8 -*-
import os
import pandas as pd
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from ..utils import responses as resp
from ..utils.responses import response_with
# from ..utils.sql_build import sql_insert, sql_update, sql_delete, sql_select
from ..utils.database import db
from datetime import datetime


# 當月剩餘預算
def remain_budget():
    # 目前時間
    now = datetime.now()
    current_month = now.strftime("%Y-%m")
    start_date = now.replace(day=1).strftime('%Y-%m-%d')
    end_date = now.replace(day=30).strftime('%Y-%m-%d')

    # 讀取預算表計算目前月份的總預算
    query = f"SELECT * FROM upload_bg_data WHERE month = '{current_month}'"
    df_bg = pd.read_sql(query, con=db.engine)
    total_bg = int(df_bg['cost'].sum())

    # 讀取收支表計算目前月份的總支出
    query = f"SELECT * FROM upload_in_ex_data WHERE date BETWEEN '{start_date}' AND '{end_date}' AND type = '支出'"
    df_ie = pd.read_sql(query, con=db.engine)
    total_ie = int(df_ie['cost'].sum())

    res = {
        "value": total_bg - total_ie,
        "percent": (total_bg - total_ie) / total_bg
    }
    return response_with(resp.SUCCESS_200, value={"data": res})


# 總收入/總支出/總結餘
def total(request):
    data = request.get_json()
    income_category = data.get("income_category")
    expend_category = data.get("expend_category")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    categories = (income_category or []) + (expend_category or [])

    df = pd.read_sql('upload_in_ex_data', con=db.engine)
    filtered_df = df[(df['category'].isin(categories)) & (df['date'] >= start_date) & (df['date'] <= end_date)]

    income_res = int(filtered_df[(filtered_df['type'] == '收入')]['cost'].sum())
    expend_res = int(filtered_df[(filtered_df['type'] == '支出')]['cost'].sum())
    remain_res = income_res - expend_res

    res = {
        'income': income_res,
        'expend': expend_res,
        'remain': remain_res
    }
    return response_with(resp.SUCCESS_200, value={"data": res})


# 收入/支出排名
def rank(request):
    data = request.get_json()
    income_category = data.get("income_category")
    expend_category = data.get("expend_category")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    categories = (income_category or []) + (expend_category or [])

    df = pd.read_sql('upload_in_ex_data', con=db.engine)
    filtered_df = df[(df['category'].isin(categories)) & (df['date'] >= start_date) & (df['date'] <= end_date)]

    income_df = filtered_df[(filtered_df['type'] == '收入')]
    expend_df = filtered_df[(filtered_df['type'] == '支出')]

    # 資料轉換格式並輸出
    def get_summary(org_df, type_name):
        df_type = org_df[org_df['type'] == type_name]

        # 分組加總
        grouped = (
            df_type.groupby('category')['cost']
            .sum()
            .reset_index()
            .sort_values(by='cost', ascending=False)
        )

        total_res = grouped['cost'].sum()

        # 建立dict結構
        summary = [
            {
                "category": row['category'],
                "value": int(row['cost']),
                "percent": round(row['cost'] / total_res, 2) if total_res > 0 else 0
            }
            for _, row in grouped.iterrows()
        ]
        return summary

    res = {
        'income': get_summary(income_df, '收入'),
        'expend': get_summary(expend_df, '支出')
    }

    return response_with(resp.SUCCESS_200, value={"data": res})


# 每日總收入/支出資料
def each_date_total(request):
    data = request.get_json()
    income_category = data.get("income_category")
    expend_category = data.get("expend_category")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    categories = (income_category or []) + (expend_category or [])

    df = pd.read_sql('upload_in_ex_data', con=db.engine)
    filtered_df = df[(df['category'].isin(categories)) & (df['date'] >= start_date) & (df['date'] <= end_date)]

    # 分組加總
    grouped = (
        filtered_df.groupby(['date', 'type'])['cost']
        .sum()
        .reset_index()
        .sort_values(by=['date', 'type'])
    )

    res = {}
    for _, row in grouped.iterrows():
        date_str = row['date']
        type_key = 'income' if row['type'] == '收入' else 'expend'

        if date_str not in res:
            res[date_str] = {'income': 0, 'expend': 0}

        res[date_str][type_key] = int(row['cost'])

    return response_with(resp.SUCCESS_200, value={"data": res})


# 每日支出前兩名
def each_date_rank(request):
    data = request.get_json()
    income_category = data.get("income_category")
    expend_category = data.get("expend_category")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    categories = (income_category or []) + (expend_category or [])

    df = pd.read_sql('upload_in_ex_data', con=db.engine)
    expend_df = df[(df['category'].isin(categories)) & (df['date'] >= start_date) & (df['date'] <= end_date) & (df['type'] == '支出')]

    # 分組加總
    grouped = (
        expend_df.groupby(['date', 'category'])['cost']
        .sum()
        .reset_index()
    )

    res = {}
    for _, row in grouped.iterrows():
        date_str = row['date']
        category = row['category']
        cost = int(row['cost'])

        if date_str not in res:
            res[date_str] = {}

        res[date_str][category] = cost

    return response_with(resp.SUCCESS_200, value={"data": res})


# 詳細品項排名
def detail_rank(request):
    data = request.get_json()
    income_category = data.get("income_category")
    expend_category = data.get("expend_category")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    categories = (income_category or []) + (expend_category or [])

    df = pd.read_sql('upload_in_ex_data', con=db.engine)
    expend_df = df[(df['category'].isin(categories)) & (df['date'] >= start_date) & (df['date'] <= end_date) & (df['type'] == '支出')]

    # 分組加總
    grouped = (
        expend_df.groupby('name')
        .size()
        .reset_index(name='count')
        .sort_values(by='count', ascending=False)
    )

    return response_with(resp.SUCCESS_200, value={"data": grouped.to_dict('records')})
