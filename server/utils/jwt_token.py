from flask import jsonify, request
from functools import wraps
import datetime
import jwt


# JWT密鑰
SECRET_KEY = "your_secret_key"

# 設置JWT的有效時間
JWT_EXPIRATION_DELTA = datetime.timedelta(hours=1)


# 生成JWT token
def create_jwt(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + JWT_EXPIRATION_DELTA  # 設置過期時間
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


# 驗證機制
def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # 取得Bearer token

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # 驗證 token
            decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f()  # 傳遞解碼後的user_id給路由函數

    return decorated_function
