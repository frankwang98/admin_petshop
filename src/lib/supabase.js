// Supabase 客户端
import SUPABASE_CONFIG from '../config.js';

const db = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

// 提交预约
export async function createAppointment(data) {
  const { pet_name, pet_type, service, phone } = data;
  return await db.from('appointments').insert({
    pet_name,
    pet_type,
    service,
    phone,
    status: 'pending'
  });
}

// 获取预约列表
export async function getAppointments() {
  return await db.from('appointments').select('*').order('created_at', { ascending: false });
}

// 更新预约状态
export async function updateStatus(id, status) {
  return await db.from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export default db;