# -*- coding: utf-8 -*-
import os
from flask import Blueprint, request
from ..lib import users

users_routes = Blueprint("users_routes", __name__)


# 登入
@users_routes.route('/login', methods=['POST'])
def login():
    res = users.login(request)
    return res
