import {get,post,put,_delete} from "@/util/request";
// 获取商品分类数据列表
export const getCategorie = params => get('categories',params)
// 添加分类
export const addCategorie = params => post('categories',params)
// 根据分类id修改分类名称
export const editCateNameByCateId = (cat_id,params) => put(`categories/${cat_id}`,params)
// 根据分类id删除分类
export const deleteCateByID = cat_id => _delete(`categories/${cat_id}`)
// 获取对应id的参数列表
// sel:<only/many> only获取静态参数,many获取动态参数
export const getCateAttributesById = (cat_id,sel) => get(`categories/${cat_id}/attributes`,sel)
// 根据分类id添加动态或静态参数
// attr_sel:<only/many> only添加静态参数,many添加动态参数
export const addCateAttributesById = (cat_id,params) => post(`categories/${cat_id}/attributes`,params)
// 根据分类id和参数id编辑动态或静态参数
export const editCateAttributesById = (cat_id,attr_id,params) => put(`categories/${cat_id}/attributes/${attr_id}`,params)
// 根据分类id和参数id删除动态或静态参数
export const deleteCateAttributesById = (cat_id,attr_id) => _delete(`categories/${cat_id}/attributes/${attr_id}`)

// 获取商品列表数据
export const getGoodsList = params => get('goods',params)
// 根据商品id删除商品
export const removeShopById = shop_id => _delete(`goods/${shop_id}`)
// 新增商品
export const addShop = params => post('goods',params)
