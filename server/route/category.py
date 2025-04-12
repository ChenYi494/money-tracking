# -*- coding: utf-8 -*-
from flask import Blueprint, request
from ..lib import category
from .. utils.jwt_token import jwt_required

category_routes = Blueprint("category_routes", __name__)


# 取得所有分類
@category_routes.route('/info', methods=['GET'])
@jwt_required
def category_info():
    res = category.category_info()
    return res


# 新增一筆分類
@category_routes.route('/create', methods=['POST'])
@jwt_required
def create_category():
    res = category.create_category(request)
    return res


# 刪除一筆分類
@category_routes.route('delete', methods=['POST'])
@jwt_required
def delete_category():
    res = category.delete_category(request)
    return res
