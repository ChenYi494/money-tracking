import os


class Config(object):
    DEBUG = True
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "postgresql://money_demo2_db_user:1z0KPUnXzm6AXLwD9VYmkGYTZNf4uHig@dpg-cvn85kfgi27c73bii1jg-a.oregon-postgres.render.com/money_demo2_db"
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        'pool_timeout': 900,
        'pool_size': 50,
        'max_overflow': 10,
    }

