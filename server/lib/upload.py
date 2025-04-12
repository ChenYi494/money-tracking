# -*- coding: utf-8 -*-
import pandas as pd
from ..model.upload import Upload_Ex_In, Upload_Bg
from ..utils import responses as resp
from ..utils.responses import response_with
from ..utils.database import db


# 取得所有收支上傳紀錄
def record_ie():
    try:
        # 讀取資料表
        df = pd.read_sql("upload_in_ex_data", con=db.engine)
        df["update_time"] = df["update_time"].astype(str)

        # 以日期分組
        result_list = []
        for date, group in df.groupby("date"):
            total_income = 0
            total_expend = 0
            income_detail = []
            expend_detail = []

            for _, row in group.iterrows():
                each_data = {
                    "id": row["id"],
                    "type": row["type"],
                    "category": row["category"],
                    "name": row["name"],
                    "data": row["cost"],
                    "commit": row["commit"],
                    "update_time": row["update_time"]
                }

                if row["type"] == "收入":
                    total_income += row["cost"]
                    income_detail.append(each_data)
                else:
                    total_expend += row["cost"]
                    expend_detail.append(each_data)

            result_list.append({
                "date": date,
                "total_income": total_income,
                "total_expend": total_expend,
                "income_detail": income_detail,
                "expend_detail": expend_detail
            })

        return response_with(resp.SUCCESS_200, value={"data": result_list})
    except Exception as e:
        print(f"讀取資料錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="讀取收支資料失敗")


# 取得所有預算上傳紀錄
def record_bg():
    try:
        # 讀取資料表
        df = pd.read_sql("upload_bg_data", con=db.engine)
        df["update_time"] = df["update_time"].astype(str)

        # 以月份分組
        result_list = []
        for month, group in df.groupby("month"):
            total_budget = 0
            budget_detail = []

            for _, row in group.iterrows():
                each_data = {
                    "id": row["id"],
                    "type": row["type"],
                    "category": row["category"],
                    "name": row["name"],
                    "data": row["cost"],
                    "commit": row["commit"],
                    "update_time": row["update_time"]
                }

                total_budget += row["cost"]
                budget_detail.append(each_data)

            result_list.append({
                "month": month,
                "total_budget": total_budget,
                "budget_detail": budget_detail,
            })

        return response_with(resp.SUCCESS_200, value={"data": result_list})
    except Exception as e:
        print(f"讀取資料錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="讀取預算資料失敗")


# 新增一筆紀錄
def create_data(request):
    try:
        data = request.get_json()
        data_type = data.get("type")
        category = data.get("category"),
        name = data.get("name"),
        date = data.get("date"),  # 收支
        month = data.get("month"),  # 預算
        cost = data.get("cost"),
        commit = data.get("commit"),
        update_time = data.get("update_time"),
        user = data.get("user")

        # 建立新的分類資料
        if data_type in ["收入", "支出"]:
            new_data = Upload_Ex_In(
                type=data_type,
                category=category,
                name=name,
                date=date,
                cost=cost,
                commit=commit,
                update_time=update_time,
                user=user
            )
        else:
            new_data = Upload_Bg(
                type=data_type,
                category=category,
                name=name,
                month=month,
                cost=cost,
                commit=commit,
                update_time=update_time,
                user=user
            )

        # 寫入資料庫
        db.session.add(new_data)
        db.session.commit()

        return response_with(resp.SUCCESS_200, value={"data": "成功新增一筆資料"})

    except Exception as e:
        print(f"新增資料錯誤：{e}")
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": "新增資料失敗，請重新操作"})


# 更新一筆紀錄
def update_data(request):
    try:
        data = request.get_json()
        data_type = data.get("type")
        data_id = data.get("id")

        if not data_type or not data_id:
            return response_with(resp.BAD_REQUEST_400, value={"data": "參數缺失"})

        # 依據type選擇資料表
        if data_type in ["收入", "支出"]:
            selected_data = db.session.query(Upload_Ex_In).filter_by(id=data_id).first()
        else:
            selected_data = db.session.query(Upload_Bg).filter_by(id=data_id).first()

        if not selected_data:
            return response_with(resp.SERVER_ERROR_404, value={"data": "該資料不存在"})

        # 更新欄位資料
        selected_data.type = data.get("type", selected_data.type)
        selected_data.category = data.get("category", selected_data.category)
        selected_data.name = data.get("name", selected_data.name)
        selected_data.cost = data.get("cost", selected_data.cost)
        selected_data.commit = data.get("commit", selected_data.commit)
        selected_data.update_time = data.get("update_time", selected_data.update_time)
        selected_data.user = data.get("user", selected_data.user)

        if data_type in ["收入", "支出"]:
            selected_data.date = data.get("date", selected_data.date)
        else:
            selected_data.month = data.get("month", selected_data.month)

        db.session.commit()
        return response_with(resp.SUCCESS_200, value={"data": "成功更新一筆資料"})

    except Exception as e:
        print(f"更新資料錯誤：{e}")
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": "更新失敗，請重新操作"})


# 刪除一筆紀錄
def delete_data(request):
    try:
        data = request.get_json()
        data_type = data.get("type")
        data_id = data.get("id")

        # 查找該筆資料
        if data_type in ["收入", "支出"]:
            selected_data = db.session.get(Upload_Ex_In, data_id)
        else:
            selected_data = db.session.get(Upload_Bg, data_id)

        if not selected_data:
            return response_with(resp.SERVER_ERROR_404, value={"data": "該資料不存在"})

        # 確保data屬於當前session
        selected_data = db.session.merge(selected_data)

        # 刪除該筆資料
        db.session.delete(selected_data)
        db.session.commit()

        return response_with(resp.SUCCESS_200, value={"data": "成功刪除一筆資料"})

    except Exception as e:
        print(f"刪除資料錯誤：{e}")
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, value={"data": "刪除失敗，請重新操作"})
