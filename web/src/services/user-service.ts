// src/services/user-service.ts
import registerServer from '@/utils/register-server';
import request, { post } from '@/utils/request';

// 动态配置 API 基路径，默认值为 /ragflow/api
const API_BASE = process.env.UMI_API_BASE || '/ragflow/api';
const api_host = `${API_BASE}/v1`;

const methods = {
  login: {
    url: `${api_host}/user/login`, // /ragflow/api/v1/user/login
    method: 'post',
  },
  logout: {
    url: `${api_host}/user/logout`, // /ragflow/api/v1/user/logout
    method: 'get',
  },
  register: {
    url: `${api_host}/user/register`, // /ragflow/api/v1/user/register
    method: 'post',
  },
  setting: {
    url: `${api_host}/user/setting`, // /ragflow/api/v1/user/setting
    method: 'post',
  },
  user_info: {
    url: `${api_host}/user/info`, // /ragflow/api/v1/user/info
    method: 'get',
  },
  get_tenant_info: {
    url: `${api_host}/user/tenant_info`, // /ragflow/api/v1/user/tenant_info
    method: 'get',
  },
  set_tenant_info: {
    url: `${api_host}/user/set_tenant_info`, // /ragflow/api/v1/user/set_tenant_info
    method: 'post',
  },
  factories_list: {
    url: `${api_host}/llm/factories`, // /ragflow/api/v1/llm/factories
    method: 'get',
  },
  llm_list: {
    url: `${api_host}/llm/list`, // /ragflow/api/v1/llm/list
    method: 'get',
  },
  my_llm: {
    url: `${api_host}/llm/my_llms`, // /ragflow/api/v1/llm/my_llms
    method: 'get',
  },
  set_api_key: {
    url: `${api_host}/llm/set_api_key`, // /ragflow/api/v1/llm/set_api_key
    method: 'post',
  },
  add_llm: {
    url: `${api_host}/llm/add_llm`, // /ragflow/api/v1/llm/add_llm
    method: 'post',
  },
  delete_llm: {
    url: `${api_host}/llm/delete_llm`, // /ragflow/api/v1/llm/delete_llm
    method: 'post',
  },
  getSystemStatus: {
    url: `${api_host}/system/status`, // /ragflow/api/v1/system/status
    method: 'get',
  },
  getSystemVersion: {
    url: `${api_host}/system/version`, // /ragflow/api/v1/system/version
    method: 'get',
  },
  deleteFactory: {
    url: `${api_host}/llm/delete_factory`, // /ragflow/api/v1/llm/delete_factory
    method: 'post',
  },
  listToken: {
    url: `${api_host}/system/token_list`, // /ragflow/api/v1/system/token_list
    method: 'get',
  },
  createToken: {
    url: `${api_host}/system/new_token`, // /ragflow/api/v1/system/new_token
    method: 'post',
  },
  removeToken: {
    url: `${api_host}/system/token`, // /ragflow/api/v1/system/token
    method: 'delete',
  },
  getSystemConfig: {
    url: `${api_host}/system/config`, // /ragflow/api/v1/system/config
    method: 'get',
  },
  setLangfuseConfig: {
    url: `${api_host}/langfuse/api_key`, // /ragflow/api/v1/langfuse/api_key
    method: 'put',
  },
  getLangfuseConfig: {
    url: `${api_host}/langfuse/api_key`, // /ragflow/api/v1/langfuse/api_key
    method: 'get',
  },
  deleteLangfuseConfig: {
    url: `${api_host}/langfuse/api_key`, // /ragflow/api/v1/langfuse/api_key
    method: 'delete',
  },
  tokenLogin: {
    url: `${api_host}/user/token-login`, // /ragflow/api/v1/user/token-login
    method: 'post',
  },
} as const;

const userService = registerServer<keyof typeof methods>(methods, request);

export const listTenantUser = (tenantId: string) =>
  request.get(`${api_host}/tenant/${tenantId}/user/list`);

export const addTenantUser = (tenantId: string, email: string) =>
  post(`${api_host}/tenant/${tenantId}/user`, { email });

export const deleteTenantUser = ({
  tenantId,
  userId,
}: {
  tenantId: string;
  userId: string;
}) => request.delete(`${api_host}/tenant/${tenantId}/user/${userId}`);

export const listTenant = () => request.get(`${api_host}/tenant/list`);

export const agreeTenant = (tenantId: string) =>
  request.put(`${api_host}/tenant/agree/${tenantId}`);

export default userService;
