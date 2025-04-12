# -*- coding: utf-8 -*-
from flask import Blueprint, request
from ..lib import analyze
from .. utils.jwt_token import jwt_required

analyze_routes = Blueprint("analyze_routes", __name__)


# 當月剩餘預算
@analyze_routes.route('/remain_budget', methods=['GET'])
@jwt_required
def remain_budget():
    res = analyze.remain_budget()
    return res


# 總收入/總支出/總結餘
@analyze_routes.route('/total', methods=['POST'])
@jwt_required
def total():
    res = analyze.total(request)
    return res


# 收入/支出排名
@analyze_routes.route('/rank', methods=['POST'])
@jwt_required
def rank():
    res = analyze.rank(request)
    return res


# 每日總收入/支出資料
@analyze_routes.route('/each_date_total', methods=['POST'])
@jwt_required
def each_date_total():
    res = analyze.each_date_total(request)
    return res


# 每日支出前兩名
@analyze_routes.route('/each_date_rank', methods=['POST'])
@jwt_required
def each_date_rank():
    res = analyze.each_date_rank(request)
    return res


# 詳細品項排名
@analyze_routes.route('/detail_rank', methods=['POST'])
@jwt_required
def detail_rank():
    res = analyze.detail_rank(request)
    return res

