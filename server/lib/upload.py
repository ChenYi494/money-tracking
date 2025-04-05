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


# 取得所有上傳紀錄(包含收支/預算)
def record():
    # 讀取兩張表
    df1 = pd.read_sql('upload_in_ex_data', con=db.engine).rename(columns={"date": "time"})
    df2 = pd.read_sql('upload_bg_data', con=db.engine).rename(columns={"month": "time"})

    # 添加big_type欄位
    df1, df2 = df1.assign(big_type='收支'), df2.assign(big_type='預算')

    # 合併表格
    df_merge = pd.concat([df1, df2], ignore_index=True)

    # 確保update_time轉為字串
    if 'update_time' in df_merge.columns:
        df_merge['update_time'] = df_merge['update_time'].astype(str).fillna('')

    return response_with(resp.SUCCESS_200, value={"data": df_merge.to_dict('records')})


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
