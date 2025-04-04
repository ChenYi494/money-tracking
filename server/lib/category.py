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


# 取得所有分類
def category_info():
    df = pd.read_sql('category', con=db.engine)
    return response_with(resp.SUCCESS_200, value={"data": df.to_dict('records')})


# 新增一筆分類
def create_category(request):
    data = request.get_json()
    return response_with(resp.SUCCESS_200, value={"data": "新增成功"})


# 刪除一筆分類
def delete_category(request):
    data = request.get_json()
    return response_with(resp.SUCCESS_200, value={"data": "刪除成功"})
