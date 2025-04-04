from flask import Flask, jsonify, request
from waitress import serve
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
# from model import db, User
from server.model import db, User
import psycopg2

app = Flask(__name__)
CORS(app)  # 允許所有來源的請求

# 用的是external url
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://money_demo2_db_user:1z0KPUnXzm6AXLwD9VYmkGYTZNf4uHig@dpg-cvn85kfgi27c73bii1jg-a.oregon-postgres.render.com/money_demo2_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化資料庫
db.init_app(app)

# 建立資料表
with app.app_context():
    db.create_all()


# 取得使用者
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{"id": user.id, "name": user.name} for user in users]
    return jsonify(user_list)


# 新增使用者 (POST)
@app.route('/api/create_user', methods=['POST'])
def add_user():
    data = request.json  # 從請求中取得 JSON 資料
    name = data.get('name')

    if not name:
        return jsonify({"error": "Name is required"}), 400

    new_user = User(name=name)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User added successfully"}), 201


if __name__ == "__main__":
    print('server run on port:1004')
    serve(app, host='0.0.0.0', port=1004)