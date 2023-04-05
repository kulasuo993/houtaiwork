import request from '@/utils/request'

/**
 * 角色列表
 */
export function apiAuthorizeList(data) {
  return request({
    url: '/rbac/role-list',
    method: 'post',
    data
  })
}

/**
 * 添加角色
 */
export function apiAuthorizeCreate(data) {
  return request({
    url: '/rbac/create-role',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 */
export function apiAuthorizeEdit(data) {
  return request({
    url: '/rbac/update-role',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 */
export function apiAuthorizeDelete(data) {
  return request({
    url: '/rbac/delete-role',
    method: 'post',
    data
  })
}

/**
* 权限列表
*/
export function apiPermissionList(data) {
  return request({
    url: '/rbac/permission-list',
    method: 'post',
    data
  })
}

/**
* 创建权限
*/
export function apiPermissionCreat(data) {
  return request({
    url: '/rbac/create-permission',
    method: 'post',
    data
  })
}

/**
* 修改权限
*/
export function apiPermissionEdit(data) {
  return request({
    url: '/rbac/update-permission',
    method: 'post',
    data
  })
}

/**
* 获取权限信息
*/
export function apiGetPermission(data) {
  return request({
    url: '/rbac/get-permission',
    method: 'post',
    data
  })
}

/**
* 删除权限
*/
export function apiDeletePermission(data) {
  return request({
    url: '/rbac/delete-permission',
    method: 'post',
    data
  })
}

/**
* 获取权限分类信息
*/
export function apiGetPermissionCategory(data) {
  return request({
    url: '/rbac/get-permission-category',
    method: 'post',
    data
  })
}

/**
* 获取全部权限信息
*/
export function apiGetAllPermissionCategory(data) {
  return request({
    url: '/rbac/get-all-permission',
    method: 'post',
    data
  })
}


/**
* 管理员列表
*/
export function apiAdminUserList(data) {
  return request({
    url: '/admin-user/list',
    method: 'post',
    data
  })
}


/**
* 添加管理员
*/
export function apiAdminUserCreat(data) {
  return request({
    url: '/admin-user/create',
    method: 'post',
    data
  })
}

/**
* 修改管理员
*/
export function apiAdminUserCUpdata(data) {
  return request({
    url: '/admin-user/update',
    method: 'post',
    data
  })
}

/**
* 删除管理员
*/
export function apiAdminUserDelete(data) {
  return request({
    url: '/admin-user/delete',
    method: 'post',
    data
  })
}