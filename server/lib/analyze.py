# -*- coding: utf-8 -*-
import pandas as pd
from ..utils import responses as resp
from ..utils.responses import response_with
from ..utils.database import db
from datetime import datetime
import calendar


# 當月剩餘預算
def remain_budget():
    try:
        # 目前時間
        now = datetime.now()
        current_month = now.strftime("%Y-%m")
        _, last_day = calendar.monthrange(now.year, now.month)

        start_date = now.replace(day=1).strftime("%Y-%m-%d")
        end_date = now.replace(day=last_day).strftime("%Y-%m-%d")

        # 讀取預算表，計算當前月份的總預算
        query = f"SELECT * FROM upload_bg_data WHERE month = '{current_month}'"
        df_bg = pd.read_sql(query, con=db.engine)
        total_bg = int(df_bg["cost"].sum())

        # 讀取收支表，計算當前月份的總支出
        query = f"SELECT * FROM upload_in_ex_data WHERE date BETWEEN '{start_date}' AND '{end_date}' AND type = '支出'"
        df_ie = pd.read_sql(query, con=db.engine)
        total_ie = int(df_ie["cost"].sum())

        # 如果當月預算為0(使用者尚未新增資料)，統一回傳-999，由前端判斷顯示方式
        res = {
            "value": -999 if total_bg == 0 else total_bg - total_ie,
            "percent": -999 if total_bg == 0 else (total_bg - total_ie) / total_bg
        }
        return response_with(resp.SUCCESS_200, value={"data": res})
    except Exception as e:
        print(f"計算錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="計算錯誤")


# 總收入/總支出/總結餘
def total(request):
    try:
        # 取得參數
        income_category, expend_category, start_date, end_date = get_data(request).values()

        # 取得種類
        categories = (income_category or []) + (expend_category or [])

        # 取得篩選資料
        df = pd.read_sql("upload_in_ex_data", con=db.engine)
        filtered_df = df[(df["category"].isin(categories)) & (df["date"] >= start_date) & (df["date"] <= end_date)]

        income_res = int(filtered_df[(filtered_df["type"] == "收入")]["cost"].sum())
        expend_res = int(filtered_df[(filtered_df["type"] == "支出")]["cost"].sum())
        remain_res = income_res - expend_res

        res = {
            "income": income_res,
            "expend": expend_res,
            "remain": remain_res
        }
        return response_with(resp.SUCCESS_200, value={"data": res})
    except Exception as e:
        print(f"計算錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="計算錯誤")


# 收入/支出排名
def rank(request):
    try:
        # 取得參數
        income_category, expend_category, start_date, end_date = get_data(request).values()

        # 取得種類
        categories = (income_category or []) + (expend_category or [])

        # 取得篩選資料
        df = pd.read_sql("upload_in_ex_data", con=db.engine)
        filtered_df = df[(df["category"].isin(categories)) & (df["date"] >= start_date) & (df["date"] <= end_date)]

        income_df = filtered_df[(filtered_df["type"] == "收入")]
        expend_df = filtered_df[(filtered_df["type"] == "支出")]

        # 資料轉換格式並輸出
        def get_summary(org_df):
            # 依照種類分組進行加總
            grouped = (
                org_df.groupby("category")["cost"]
                .sum()
                .reset_index()
                .sort_values(by="cost", ascending=False)
            )

            total_res = grouped["cost"].sum()

            # 資料輸出
            res_list = []
            for _, row in grouped.iterrows():
                res_list.append({
                    "category": row["category"],
                    "value": int(row["cost"]),
                    "percent": round(row["cost"] / total_res, 2) if total_res > 0 else 0
                })
            return res_list

        res = {
            "income": get_summary(income_df),
            "expend": get_summary(expend_df)
        }

        return response_with(resp.SUCCESS_200, value={"data": res})
    except Exception as e:
        print(f"計算錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="計算錯誤")


# 每日總收入/支出資料
def each_date_total(request):
    try:
        # 取得參數
        income_category, expend_category, start_date, end_date = get_data(request).values()

        # 取得種類
        categories = (income_category or []) + (expend_category or [])

        # 取得篩選資料
        df = pd.read_sql("upload_in_ex_data", con=db.engine)
        filtered_df = df[(df["category"].isin(categories)) & (df["date"] >= start_date) & (df["date"] <= end_date)]

        # 依照日期、類型分組進行加總
        grouped = (
            filtered_df.groupby(["date", "type"])["cost"]
            .sum()
            .reset_index()
            .sort_values(by=["date", "type"])
        )

        # 資料輸出
        res_list = {}
        for _, row in grouped.iterrows():
            date_str = row["date"]
            type_key = "income" if row["type"] == "收入" else "expend"

            if date_str not in res_list:
                res_list[date_str] = {"income": 0, "expend": 0}

            res_list[date_str][type_key] = int(row["cost"])

        return response_with(resp.SUCCESS_200, value={"data": res_list})
    except Exception as e:
        print(f"計算錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="計算錯誤")


# 每日支出前兩名
def each_date_rank(request):
    try:
        # 取得參數
        income_category, expend_category, start_date, end_date = get_data(request).values()

        # 取得種類
        categories = (income_category or []) + (expend_category or [])

        # 取得篩選資料
        df = pd.read_sql("upload_in_ex_data", con=db.engine)
        expend_df = df[(df["category"].isin(categories)) & (df["date"] >= start_date) & (df["date"] <= end_date) & (df["type"] == "支出")]

        # 分組加總
        grouped = (
            expend_df.groupby(["date", "category"])["cost"]
            .sum()
            .reset_index()
            .sort_values(by=["date", "cost"], ascending=[True, False])
        )

        # 資料輸出
        res_list = {}
        for _, row in grouped.iterrows():
            date_str = row['date']
            category = row['category']
            cost = int(row['cost'])

            if date_str not in res_list:
                res_list[date_str] = {}

            res_list[date_str][category] = cost

        return response_with(resp.SUCCESS_200, value={"data": res_list})
    except Exception as e:
        print(f"計算錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="計算錯誤")


# 詳細品項排名
def detail_rank(request):
    try:
        # 取得參數
        income_category, expend_category, start_date, end_date = get_data(request).values()

        # 取得種類
        categories = (income_category or []) + (expend_category or [])

        # 取得篩選資料
        df = pd.read_sql("upload_in_ex_data", con=db.engine)
        expend_df = df[(df["category"].isin(categories)) & (df["date"] >= start_date) & (df["date"] <= end_date) & (
                    df["type"] == "支出")]

        # 分組加總
        grouped = (
            expend_df.groupby("name")
            .size()
            .reset_index(name="count")
            .sort_values(by="count", ascending=False)
        )

        return response_with(resp.SUCCESS_200, value={"data": grouped.to_dict("records")})
    except Exception as e:
        print(f"計算錯誤: {e}")
        return response_with(resp.SERVER_ERROR_500, message="計算錯誤")


# 取得篩選參數
def get_data(request):
    data = request.get_json()
    return {
        "income_category": data.get("income_category"),
        "expend_category": data.get("expend_category"),
        "start_date": data.get("start_date"),
        "end_date": data.get("end_date")
    }
