from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# 紀錄上傳資料表(收支)
class Upload_Ex_In(db.Model):
    __tablename__ = 'upload_in_ex_data'
    id = db.Column(db.String(50), primary_key=True, comment='編號')
    type = db.Column(db.String(20), comment='種類')
    category = db.Column(db.String(20), comment='分類名稱')
    name = db.Column(db.String(20), comment='品項')
    date = db.Column(db.String(20), comment='日期')
    cost = db.Column(db.Integer, comment='費用')
    commit = db.Column(db.String(100), comment='備註')
    update_time = db.Column(db.DateTime, comment='資料更新時間')
    user = db.Column(db.String(20), comment='使用者')


# 紀錄上傳資料表(預算)
class Upload_Bg(db.Model):
    __tablename__ = 'upload_bg_data'
    id = db.Column(db.String(50), primary_key=True, comment='編號')
    type = db.Column(db.String(20), comment='種類')
    category = db.Column(db.String(20), comment='分類名稱')
    name = db.Column(db.String(20), comment='品項')
    month = db.Column(db.String(20), comment='月份')
    cost = db.Column(db.Integer, comment='費用')
    commit = db.Column(db.String(100), comment='備註')
    update_time = db.Column(db.DateTime, comment='資料更新時間')
    user = db.Column(db.String(20), comment='使用者')
