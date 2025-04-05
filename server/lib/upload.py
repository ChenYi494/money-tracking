# -*- coding: utf-8 -*-
import os
import pandas as pd
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from functools import reduce
from ..model.category import Category
from ..utils import responses as resp
from ..utils.responses import response_with
# from ..utils.sql_build import sql_insert, sql_update, sql_delete, sql_select
from ..utils.database import db
from server.model.upload import Upload_Ex_In, Upload_Bg


# 取得所有收支上傳紀錄
def record_ie():
    # 讀取兩張表
    df = pd.read_sql('upload_in_ex_data', con=db.engine)
    df['update_time'] = df['update_time'].astype(str)

    result_list = []

    # 以日期分組
    for date, group in df.groupby('date'):
        total_income = 0
        total_expend = 0
        income_detail = []
        expend_detail = []

        income_index = 1
        expend_index = 1

        for _, row in group.iterrows():
            each_data = {
                "id": row["id"],
                "type": "income" if row["type"] == "收入" else "expend",
                "category": row["category"],
                "name": row["name"],
                "data": row["cost"],
                "commit": row.get("commit", ""),  # 沒有則預設空字串
                "update_time": row["update_time"]
            }

            if row["type"] == "收入":
                income_index += 1
                total_income += row["cost"]
                income_detail.append(each_data)
            else:
                expend_index += 1
                total_expend += row["cost"]
                expend_detail.append(each_data)

        result_list.append({
            "date": date,
            "total_income": total_income,
            "total_expend": total_expend,
            "income_detail": income_detail,
            "expend_detail": expend_detail
        })

    return response_with(resp.SUCCESS_200, value={"data": result_list})


# 取得所有預算上傳紀錄
def record_bg():
    # 讀取兩張表
    df = pd.read_sql('upload_bg_data', con=db.engine)
    df['update_time'] = df['update_time'].astype(str)

    result_list = []

    # 以日期分組
    for month, group in df.groupby('month'):
        total_budget = 0
        budget_detail = []

        budget_index = 1

        for _, row in group.iterrows():
            each_data = {
                "id": row["id"],
                "type": "budget",
                "category": row["category"],
                "name": row["name"],
                "data": row["cost"],
                "commit": row.get("commit", ""),  # 沒有則預設空字串
                "update_time": row["update_time"]
            }

            budget_index += 1
            total_budget += row["cost"]
            budget_detail.append(each_data)

        result_list.append({
            "month": month,
            "total_budget": total_budget,
            "budget_detail": budget_detail,
        })

    return response_with(resp.SUCCESS_200, value={"data": result_list})


# 新增一筆紀錄
def create_data(request):
    try:
        data = request.get_json()

        if data.get('big_type') == '預算':
            # 建立新的分類資料
            new_data = Upload_Bg(
                type=data.get('type'),
                category=data.get('category'),
                name=data.get('name'),
                month=data.get('month'),
                cost=data.get('cost'),
                commit=data.get('commit'),
                update_time=data.get('update_time'),
                user=data.get('user'),
            )
        else:
            # 建立新的分類資料
            new_data = Upload_Ex_In(
                type=data.get('type'),
                category=data.get('category'),
                name=data.get('name'),
                date=data.get('date'),
                cost=data.get('cost'),
                commit=data.get('commit'),
                update_time=data.get('update_time'),
                user=data.get('user'),
            )

        # 寫入資料庫
        db.session.add(new_data)
        db.session.commit()

        return response_with(resp.SUCCESS_200, value={"data": '成功新增一筆資料'})

    except Exception as e:
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": '新增失敗，請重新操作'})


# 更新一筆紀錄
def update_data(request):
    try:
        data = request.get_json()
        record_id = data.get('id')

        if not record_id:
            return response_with(resp.BAD_REQUEST_400, value={"data": "缺少 id"})

        # 根據big_type選擇資料表
        if data.get('big_type') == '預算':
            record = db.session.query(Upload_Bg).filter_by(id=record_id).first()
        else:
            record = db.session.query(Upload_Ex_In).filter_by(id=record_id).first()

        if not record:
            return response_with(resp.SERVER_ERROR_404, value={"data": "該資料不存在"})

        # 更新欄位資料
        record.type = data.get('type', record.type)
        record.category = data.get('category', record.category)
        record.name = data.get('name', record.name)
        record.cost = data.get('cost', record.cost)
        record.commit = data.get('commit', record.commit)
        record.update_time = data.get('update_time', record.update_time)
        record.user = data.get('user', record.user)

        if data.get('big_type') == '預算':
            record.month = data.get('month', record.month)
        else:
            record.date = data.get('date', record.date)

        db.session.commit()
        return response_with(resp.SUCCESS_200, value={"data": "成功更新一筆資料"})

    except Exception as e:
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": "更新失敗，請重新操作"})


# 刪除一筆紀錄
def delete_data(request):
    try:
        data = request.get_json()
        data_id = data.get('id')

        if data.get('big_type') == '預算':
            # 查找該筆資料
            data = db.session.get(Upload_Bg, data_id)

        else:
            # 查找該筆資料
            data = db.session.get(Upload_Ex_In, data_id)

        if not data:
            return response_with(resp.SERVER_ERROR_404, value={"data": '該資料不存在'})

        # 確保category屬於當前session
        data = db.session.merge(data)

        # 刪除該筆資料
        db.session.delete(data)
        db.session.commit()

        return response_with(resp.SUCCESS_200, value={"data": '成功刪除一筆資料'})

    except Exception as e:
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": '刪除失敗，請重新操作'})
