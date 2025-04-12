from waitress import serve
from flask import Flask
from flask_cors import CORS
# config
from server.config.config import DevelopmentConfig
# model(從extension檔案共同引入)
from server.extensions import db
# routes
from server.route.users import users_routes
from server.route.category import category_routes
from server.route.upload import upload_routes
from server.route.analyze import analyze_routes
# utils
from server.utils import responses as resp
from server.utils.responses import response_with


app = Flask(__name__)
# 允許特定來源的請求
# CORS(app, origins=[
#     "https://money-tracking-demo.netlify.app",
#     "http://localhost:4200"  # 開發用
# ])

CORS(app, origins=["*"])

app_config = DevelopmentConfig

app.config.from_object(app_config)
app.config['JSON_AS_ASCII'] = False
app.config['JSON_SORT_KEYS'] = False

# 初始化資料庫
db.init_app(app)

# 建立資料表
with app.app_context():
    db.create_all()


# routes設定
app.register_blueprint(users_routes, url_prefix='/api/users')
app.register_blueprint(category_routes, url_prefix='/api/category')
app.register_blueprint(upload_routes, url_prefix='/api/upload')
app.register_blueprint(analyze_routes, url_prefix='/api/analyze')


if __name__ == "__main__":
    print('server run on port:1004')
    serve(app, host='0.0.0.0', port=1004)
