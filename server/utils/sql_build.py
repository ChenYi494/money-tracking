def sql_insert_if_not_exist(table, insert_dict, where_list, update_dict):
    update_set_list = []
    for k, v in update_dict.items():
        update_set_list.append(f'''{k}='{v}' ''')
    update_set_str = ','.join(update_set_list)

    i_keys_str = ','.join(insert_dict.keys())
    i_values_str = "'" + "','".join(str(x) for x in insert_dict.values()) + "'"

    on_str = ','.join(where_list)

    sql_str = f'''INSERT INTO {table} ({i_keys_str}) VALUES ({i_values_str}) ON CONFLICT ({on_str}) DO UPDATE SET {update_set_str};'''
    return sql_str


def sql_insert(table, insert_dict):
    i_keys_str = ','.join(insert_dict.keys())
    i_values_str = "'" + "','".join(str(x) for x in insert_dict.values()) + "'"
    sql_str = f'''INSERT INTO {table} ({i_keys_str}) VALUES ({i_values_str});'''
    return sql_str


def sql_update(table, where_dict, update_dict):
    update_set_list = []
    for k, v in update_dict.items():
        update_set_list.append(f'''{k}='{v}' ''')
    update_set_str = ','.join(update_set_list)

    where_list = []
    for k, v in where_dict.items():
        where_list.append(f'''{k}='{v}' ''')
    where_str = ','.join(where_list)

    sql_str = f'''UPDATE {table} SET {update_set_str} WHERE {where_str};'''
    return sql_str

