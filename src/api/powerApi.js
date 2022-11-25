import {get,post,put,_delete} from '@/util/request'
// 获取所有权限列表
// type值为 list 或 tree , list 列表显示权限, tree 树状显示权限,
export const get_rightsList = type => get(`rights/${type}`)
// 获取所有用户角色列表
export const get_rolesList = () => get('roles')
// 添加角色
export const addRoles = params => post('roles',params)
// 根据id查询角色
export const getRolesById = id => get(`roles/${id}`)
// 根据id修改角色
export const editRolesById = (id,params) => put(`roles/${id}`,params)
// 根据id删除角色
export const deleteRolesById = id => _delete(`roles/${id}`)
// 删除指定角色的指定权限
export const deleteRightByRolesId = (roleId,rightId) => _delete(`roles/${roleId}/rights/${rightId}`)
// 根据角色id授权权限
// rids为权限ID列表,类型为字符串,包含所有选中的节点key
export const setRightByRolesId = (roleId, rids) => post(`roles/${roleId}/rights`,rids)
