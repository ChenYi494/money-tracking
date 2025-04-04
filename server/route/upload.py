# -*- coding: utf-8 -*-
import os
from flask import Blueprint, request
from ..lib import upload
from flask_jwt_extended import jwt_required

upload_routes = Blueprint("upload_routes", __name__)


# 取得所有上傳紀錄(包含收支/預算)
@upload_routes.route('/record', methods=['GET'])
# @jwt_required()
def record():
    res = upload.record()
    return res


# 新增一筆紀錄
@upload_routes.route('/create_data', methods=['POST'])
# @jwt_required()
def create_data():
    res = upload.create_data(request)
    return res


# 更新一筆紀錄
@upload_routes.route('/update_data', methods=['POST'])
# @jwt_required()
def update_data():
    res = upload.update_data(request)
    return res


# 刪除一筆紀錄
@upload_routes.route('/delete_data', methods=['POST'])
# @jwt_required()
def delete_data():
    res = upload.delete_data(request)
    return res
