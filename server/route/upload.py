# -*- coding: utf-8 -*-
from flask import Blueprint, request
from ..lib import upload
from .. utils.jwt_token import jwt_required

upload_routes = Blueprint("upload_routes", __name__)


# 取得所有收支上傳紀錄
@upload_routes.route('/record_ie', methods=['GET'])
@jwt_required
def record_ie():
    res = upload.record_ie()
    return res


# 取得所有預算上傳紀錄
@upload_routes.route('/record_bg', methods=['GET'])
@jwt_required
def record_bg():
    res = upload.record_bg()
    return res


# 新增一筆紀錄
@upload_routes.route('/create_data', methods=['POST'])
@jwt_required
def create_data():
    res = upload.create_data(request)
    return res


# 更新一筆紀錄
@upload_routes.route('/update_data', methods=['POST'])
@jwt_required
def update_data():
    res = upload.update_data(request)
    return res


# 刪除一筆紀錄
@upload_routes.route('/delete_data', methods=['POST'])
@jwt_required
def delete_data():
    res = upload.delete_data(request)
    return res
