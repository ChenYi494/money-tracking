import uuid
from sqlalchemy.dialects.postgresql import UUID
from ..utils.database import db

# 收支種類資料表
class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, comment='編號')
    type = db.Column(db.String(20), comment='種類')
    name = db.Column(db.String(20), comment='分類名稱')

