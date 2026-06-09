// 管理后台
import { getAppointments, updateStatus } from './lib/supabase.js';

const statusMap = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消'
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

window.loadAppointments = async function() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '<tr><td colspan="7" class="loading">加载中...</td></tr>';

  try {
    const { data, error } = await getAppointments();
    if (error) throw error;

    // 更新统计
    const counts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    data?.forEach(item => counts[item.status]++);
    document.getElementById('countPending').textContent = counts.pending;
    document.getElementById('countConfirmed').textContent = counts.confirmed;
    document.getElementById('countCompleted').textContent = counts.completed;
    document.getElementById('countCancelled').textContent = counts.cancelled;

    if (!data?.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty">暂无预约记录</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td>${escapeHtml(item.pet_name)}</td>
        <td>${escapeHtml(item.pet_type)}</td>
        <td>${escapeHtml(item.service)}</td>
        <td>${escapeHtml(item.phone)}</td>
        <td><span class="status-badge ${item.status}">${statusMap[item.status]}</span></td>
        <td>${formatDate(item.created_at)}</td>
        <td class="actions">
          ${item.status === 'pending' ? `<button class="action-btn confirm" onclick="window.handleStatus('${item.id}', 'confirmed')">确认</button>` : ''}
          ${item.status !== 'completed' && item.status !== 'cancelled' ? `<button class="action-btn done" onclick="window.handleStatus('${item.id}', 'completed')">完成</button>` : ''}
          ${item.status !== 'cancelled' && item.status !== 'completed' ? `<button class="action-btn cancel" onclick="window.handleStatus('${item.id}', 'cancelled')">取消</button>` : ''}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="7" class="empty">加载失败，请检查配置</td></tr>';
  }
};

window.handleStatus = async function(id, status) {
  try {
    const { error } = await updateStatus(id, status);
    if (error) throw error;
    showToast('状态已更新');
    window.loadAppointments();
  } catch (err) {
    console.error(err);
    showToast('更新失败');
  }
};

// 初始加载
window.loadAppointments();