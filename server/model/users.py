from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# 使用者資料表
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(50), primary_key=True, comment='編號')
    name = db.Column(db.String(20), comment='名稱')
    password = db.Column(db.String(100), comment='密碼')
