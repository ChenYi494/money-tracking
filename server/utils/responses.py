# -*- coding: utf-8 -*-
from flask import make_response, jsonify


# 請求成功(伺服器回傳資料)
SUCCESS_200 = {
    "http_code": 200,
    "code": "success"
}

# 請求錯誤(參數缺失/格式錯誤)
BAD_REQUEST_400 = {
    "http_code": 400,
    "code": "badRequest",
    "message": "Bad request!"
}

# 未經授權
UNAUTHORIZED_401 = {
    "http_code": 401,
    "code": "notAuthorized",
    "message": "Invalid authentication!"
}

# 沒有權限
FORBIDDEN_403 = {
    "http_code": 403,
    "code": "notAuthorized",
    "message": "You are not authorized to execute this!"
}

# 找不到資源(讀表或其他請求找不到對應內容)
SERVER_ERROR_404 = {
    "http_code": 404,
    "code": "notFound",
    "message": "Resource not found!"
}

# 請求錯誤(格式正確，但內容不正確)
INVALID_INPUT_422 = {
    "http_code": 422,
    "code": "invalidInput",
    "message": "Invalid input"
}

# 伺服器端處理請求發生錯誤
SERVER_ERROR_500 = {
    "http_code": 500,
    "code": "serverError",
    "message": "Server error"
}


# 回傳格式
def response_with(response, value=None, message=None, error=None, headers={}, pagination=None):
    result = {}
    if value is not None:
        result.update(value)

    if response.get('message', None) is not None:
        result.update({'message': response['message']})

    result.update({'code': response['code']})

    if error is not None:
        result.update({'errors': error})

    if pagination is not None:
        result.update({'pagination': pagination})

    headers.update({'Access-Control-Allow-Origin': '*'})
    headers.update({'server': 'Flask REST API'})
    res = make_response(jsonify(result), response['http_code'], headers)

    return res
