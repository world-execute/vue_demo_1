import {get,post,put,_delete} from "@/util/request";
// 获取商品分类数据列表
export const getCategorie = params => get('categories',params)
// 添加分类
export const addCategorie = params => post('categories',params)
// 根据分类id修改分类名称
export const editCateNameByCateId = (cat_id,params) => put(`categories/${cat_id}`,params)
// 根据分类id删除分类
export const deleteCateByID = cat_id => _delete(`categories/${cat_id}`)
