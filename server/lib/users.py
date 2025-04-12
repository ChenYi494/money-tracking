# -*- coding: utf-8 -*-
import pandas as pd
from ..utils import responses as resp
from ..utils.responses import response_with
from ..utils.database import db
from ..utils.jwt_token import create_jwt


# 登入
def login(request):
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    df = pd.read_sql('users', con=db.engine)

    # 驗證名稱和密碼
    if username in df['name'].values:
        user_data = df[df['name'] == username].iloc[0]
        if user_data['password'] == password:
            token = create_jwt(username)
            return response_with(resp.SUCCESS_200, value={"data": "登入成功", "token": token})
        else:
            return response_with(resp.SERVER_ERROR_500, value={"data": '密碼錯誤，請重新登入'})
    else:
        return response_with(resp.SERVER_ERROR_404, value={"data": '帳號錯誤，請重新登入'})
