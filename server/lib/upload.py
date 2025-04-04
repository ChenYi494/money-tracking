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


# 取得所有上傳收支紀錄
def get_ie_record():
    df = pd.read_sql('upload_in_ex_data', con=db.engine)
    return response_with(resp.SUCCESS_200, value={"data": df.to_dict('records')})


# 新增一筆收支紀錄
def create_ie_data(request):
    data = request.get_json()
    return response_with(resp.SUCCESS_200, value={"data": "新增成功"})


# 更新一筆收支紀錄
def update_ie_data(request):
    data = request.get_json()
    return response_with(resp.SUCCESS_200, value={"data": "更新成功"})


# 刪除一筆分類
def delete_ie_data(request):
    data = request.get_json()
    return response_with(resp.SUCCESS_200, value={"data": "刪除成功"})
