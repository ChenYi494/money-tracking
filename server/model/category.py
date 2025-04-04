from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# 收支種類資料表
class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='編號')
    type = db.Column(db.String(20), comment='種類')
    name = db.Column(db.String(20), comment='分類名稱')

