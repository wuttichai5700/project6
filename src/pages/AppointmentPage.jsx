
import React, { useState } from 'react';
import './AppointmentPage.css';

function AppointmentPage() {
  const [form, setForm] = useState({
    citizen_id: '',
    fullname: '',
    phone: '',
    appointments: []
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const handleChange = (e, index, field) => {
    const newAppointments = [...form.appointments];
    newAppointments[index] = {
      ...newAppointments[index],
      [field]: e.target.value
    };
    setForm(prev => ({ ...prev, appointments: newAppointments }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'citizen_id' && value.length === 13) {
      fetchDataByCitizenId(value);
    }
  };

  const fetchDataByCitizenId = async (id) => {
    try {
      const baseURL = `${window.location.origin}/project/backend`;
      const res = await fetch(`${baseURL}/appointment.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", citizen_id: id })
      });

      const result = await res.json();
      if (result.success) {
        const d = result.data;
        setForm({
          citizen_id: d.citizen_id,
          fullname: d.fullname,
          phone: d.phone || '',
          appointments: d.appointments.map(a => ({
            date: a.appointment_date,
            medicine: a.medicine || '',
            dose: a.dose || ''
          }))
        });
        setIsEditMode(true);
      } else {
        setForm(prev => ({
          ...prev,
          fullname: '',
          phone: '',
          appointments: []
        }));
        setIsEditMode(false);
      }
    } catch {
      alert("❌ ไม่สามารถโหลดข้อมูลจากเซิร์ฟเวอร์");
    }
  };

  const handleAddRow = () => {
    setForm(prev => ({
      ...prev,
      appointments: [...prev.appointments, { date: '', medicine: '', dose: '' }]
    }));
  };

  const handleRemoveRow = (index) => {
    const updated = form.appointments.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, appointments: updated }));
  };

  const handlePrint = () => {
    const printContents = document.getElementById('print-only').innerHTML;
    const w = window.open('', '', 'width=900,height=700');
    w.document.write('<html><head><title>พิมพ์ตารางนัดหมาย</title>');
    w.document.write('<style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 4px; text-align: center; } input { border: none; width: 100%; text-align: center; }</style>');
    w.document.write('</head><body>');
    w.document.write(`<div><strong>เลขบัตรประชาชน:</strong> ${form.citizen_id || ''}<br/><strong>ชื่อ:</strong> ${form.fullname || ''}</div><br/>`);
    w.document.write(printContents);
    w.document.write('</body></html>');
    w.document.close();
    w.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validAppointments = form.appointments.filter(a => a.date.trim() !== '');
    if (validAppointments.length === 0) {
      alert("⚠️ กรุณาเพิ่มวันที่นัดหมายอย่างน้อย 1 ช่อง");
      return;
    }

    const transformedAppointments = form.appointments.map(a => ({
      appointment_date: a.date,
      actual_date: null,
      medicine: a.medicine,
      dose: a.dose
    }));

    try {
      const baseURL = `${window.location.origin}/project/backend`;
      const res = await fetch(`${baseURL}/appointment.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          citizen_id: form.citizen_id,
          fullname: form.fullname,
          phone: form.phone,
          appointments: transformedAppointments
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setForm({ citizen_id: '', fullname: '', phone: '', appointments: [] });
        setIsEditMode(false);
      } else {
        alert("❌ " + data.message);
      }
    } catch {
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'แก้ไขนัดหมาย' : 'ลงทะเบียนนัดหมาย'}</h2>

      <div className="field">
        <label>เลขบัตรประชาชน</label>
        <input type="text" name="citizen_id" value={form.citizen_id} onChange={handleTextChange} required placeholder="กรอกเลขบัตร 13 หลัก" />
      </div>

      <div className="field">
        <label>ชื่อ - นามสกุล</label>
        <input type="text" name="fullname" value={form.fullname} onChange={handleTextChange} required placeholder="กรอกชื่อ - นามสกุล" />
      </div>

      <div className="field">
        <label>เบอร์โทรศัพท์</label>
        <input type="phone" name="phone" value={form.phone} onChange={handleTextChange} required placeholder="08xxxxxxxx" />
      </div>
      <div className="button-row">
  <button type="button" onClick={handleAddRow}>
    ➕ เพิ่มวันนัด
  </button>

  <button type="button" onClick={handlePrint}>
    🖨️ พิมพ์ตารางนัดหมาย
  </button>
</div>


      <div id="print-only">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>วันนัดฉีดยา</th>
              <th>ชื่อยา</th>
              <th>ขนาดยา</th>
              <th>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {form.appointments.map((row, index) => (
              <tr key={index}>
                <td>
                  <input type="date" value={row.date} onChange={(e) => handleChange(e, index, 'date')} />
                </td>
                <td>
                  <input type="text" value={row.medicine} onChange={(e) => handleChange(e, index, 'medicine')} placeholder="ชื่อยา" />
                </td>
                <td>
                  <input type="text" value={row.dose} onChange={(e) => handleChange(e, index, 'dose')} placeholder="โดส" />
                </td>
                <td>
                  <button type="button" onClick={() => handleRemoveRow(index)}>➖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="submit">
        {isEditMode ? '💾 อัปเดตนัดหมาย' : '📝 บันทึกนัดหมาย'}
      </button>
    </form>
  );
}

export default AppointmentPage;

