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
from server.model.category import Category


# 取得所有分類
def category_info():
    df = pd.read_sql('category', con=db.engine)
    return response_with(resp.SUCCESS_200, value={"data": df.to_dict('records')})


# 新增一筆分類
def create_category(request):
    try:
        data = request.get_json()

        # 檢查必填欄位
        if not data.get('type') or not data.get('name'):
            return response_with(resp.BAD_REQUEST_400, value={"data": '參數缺失'})

        # 建立新的分類資料
        new_data = Category(
            type=data.get('type'),
            name=data.get('name')
        )

        # 寫入資料庫
        db.session.add(new_data)
        db.session.commit()

        return response_with(resp.SUCCESS_200, value={"data": '成功新增一筆分類'})

    except Exception as e:
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": '新增失敗，請重新操作'})


# 刪除一筆分類
def delete_category(request):
    try:
        data = request.get_json()
        category_id = data.get('id')

        # 查找該筆資料
        category = db.session.get(Category, category_id)

        if not category:
            return response_with(resp.SERVER_ERROR_404, value={"data": '該分類不存在'})

        # 確保category屬於當前session
        category = db.session.merge(category)

        # 刪除該筆資料
        db.session.delete(category)
        db.session.commit()

        return response_with(resp.SUCCESS_200, value={"data": '成功刪除一筆分類'})

    except Exception as e:
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": '刪除失敗，請重新操作'})

