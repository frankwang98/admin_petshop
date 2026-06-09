// 主应用
import { createAppointment } from './lib/supabase.js';

const form = document.querySelector("#bookingForm");
const note = document.querySelector("#formNote");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const petName = data.get("petName").trim();
  const service = data.get("service");
  const petType = data.get("petType");
  const phone = data.get("phone");

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "提交中...";

  try {
    const { error } = await createAppointment({
      pet_name: petName,
      pet_type: petType,
      service: service,
      phone: phone
    });

    if (error) throw error;

    note.textContent = `${petName}的${service}预约已提交，我们会尽快电话确认。`;
    form.reset();
  } catch (err) {
    console.error('提交失败:', err);
    note.textContent = "提交失败，请稍后重试或电话预约。";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});