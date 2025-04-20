// pages/ManualEntry.jsx
import React, { useState } from 'react';
import Select from 'react-select';

function ManualEntry() {
  const initialForm = {
    citizen_id: '',
    fullname: '',
    injection_date: '',
    drug_name: '',
    clinic_name: '',
    dose: '',
    position: '',
    signature: '',
  };

  const [form, setForm] = useState(initialForm);
  const [suggestedIds, setSuggestedIds] = useState([]);

  const clinics = [
    "รพ.สต.หนองช้างแล่น บ้านห้วยน้ำเย็น หมู่ที่ 02",
    "รพ.สต.หนองช้างแล่น บ้านห้วยโทง หมู่ที่ 03",
    "รพ.สต.บางดี บ้านพรุจุด หมู่ที่ 03",
    "รพ.สต.บางดี บ้านโคกแดรก หมู่ที่ 05",
    "รพ.สต.บางจัญ บ้านตลาดนาวง หมู่ที่ 02",
    "รพ.สต.บางจัญ บ้านเหนือคลอง หมู่ที่ 05",
    "รพ.สต.เขากอบ บ้านถนนแพรก หมู่ที่ 04",
    "รพ.สต.เขากอบ บ้านหนองปรือ หมู่ที่ 08",
    "รพ.สต.เขาขาว บ้านควบค้าง หมู่ที่ 07",
    "รพ.สต.เขาปูน บ้านเขาปูน หมู่ที่ 02",
    "รพ.สต.ปากแจ่ม บ้านหนองหอย หมู่ที่ 03",
    "รพ.สต.ปากคม บ้านหนองขี้เลียด หมู่ที่ 02",
    "รพ.สต.ท่าข้าม บ้านหินนอม หมู่ที่ 07",
    "รพ.สต.ลำภูรา บ้านกลาง หมู่ที่ 01",
    "รพ.สต.นาวง บ้านหนองหมง หมู่ที่ 01",
    "รพ.สต.นาวง บ้านโพธิ์ริน หมู่ที่ 06",
    "รพ.สต.ห้วยนาง บ้านห้วยนาง หมู่ที่ 02",
    "รพ.สต.ในเตา บ้านหน้าวัด หมู่ที่ 01",
    "รพ.สต.ทุ่งต่อ บ้านห้วยเล็ก หมู่ที่ 07",
    "รพ.สต.วังศรี บ้านวังกำใต้ หมู่ที่ 02"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'citizen_id') {
      if (value.length >= 4) {
        fetch('http://192.168.1.246/project/backend/suggest_ids.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: value })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setSuggestedIds(data.ids);
            } else {
              setSuggestedIds([]);
            }
          })
          .catch(() => setSuggestedIds([]));
      } else {
        setSuggestedIds([]);
      }
    }
  };

  const handleSuggestionClick = (id) => {
    setForm(prev => ({ ...prev, citizen_id: id }));
    setSuggestedIds([]);
  };

  const handleCitizenIdBlur = async () => {
    const id = form.citizen_id.trim();
    if (/^\d{13}$/.test(id)) {
      try {
        const baseURL = `${window.location.origin}/project/backend`;

        const res = await fetch(`${baseURL}/fetch_name.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        const data = await res.json();
        if (data.success) {
          setForm(prev => ({ ...prev, fullname: data.fullname }));
        } else {
          alert("ไม่พบข้อมูลในระบบ");
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = `${window.location.origin}/project/backend`;

const res = await fetch(`${baseURL}/save.php`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form)
});

      const data = await res.json();
      alert(data.success ? "✅ บันทึกข้อมูลเรียบร้อย" : "❌ บันทึกไม่สำเร็จ");

      if (!data.success) return;

      const botToken = process.env.REACT_APP_BOT_TOKEN;
      const chatId = process.env.REACT_APP_CHAT_ID;

      const telegramMessage = `
📌 บันทึกข้อมูลการฉีดยาเรียบร้อยแล้ว
👤 ชื่อ: ${form.fullname}
🆔 เลขบัตร: ${form.citizen_id}
💉 ยา: ${form.drug_name} (${form.dose})
📍 ตำแหน่งฉีด: ${form.position}
🏥 อนามัย: ${form.clinic_name}
🕒 วันที่: ${form.injection_date}
✍️ ผู้ฉีด: ${form.signature}
      `;

      const telegramPayload = {
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML'
      };

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramPayload)
      });

      setForm(initialForm);
      setSuggestedIds([]);
    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      
     

    

      <div className="field" style={{ position: 'relative' }}>
        <label>เลขบัตรประชาชน</label>
        <input type="text" name="citizen_id" value={form.citizen_id} onChange={handleChange} onBlur={handleCitizenIdBlur} required autoComplete="off" />
        {suggestedIds.length > 0 && (
          <ul style={{
            position: 'absolute',
            background: '#fff',
            listStyle: 'none',
            padding: '0.5rem',
            margin: 0,
            border: '1px solid #ccc',
            width: '100%',
            zIndex: 10
          }}>
            {suggestedIds.map((id, idx) => (
              <li
                key={idx}
                onClick={() => handleSuggestionClick(id)}
                style={{ padding: '4px', cursor: 'pointer' }}
              >
                {id}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="field">
        <label>ชื่อ - นามสกุล</label>
        <input type="text" name="fullname" value={form.fullname} onChange={handleChange} required />
      </div>

      <div className="field">
        <label>วันที่ฉีดยา</label>
        <input type="date" name="injection_date" value={form.injection_date} onChange={handleChange} required />
      </div>

      <div className="field">
        <label>ชื่อยา</label>
        <input type="text" name="drug_name" value={form.drug_name} onChange={handleChange} required />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="field" style={{ flex: 1 }}>
          <label>ขนาดยา</label>
          <input type="text" name="dose" value={form.dose} onChange={handleChange} required />
        </div>

        <div className="field" style={{ flex: 1 }}>
          <label>ตำแหน่งฉีด</label>
          <input type="text" name="position" value={form.position} onChange={handleChange} required />
        </div>

        <div className="field" style={{ flex: 1 }}>
          <label>ลายมือชื่อผู้ฉีด</label>
          <input type="text" name="signature" value={form.signature} onChange={handleChange} required />
        </div>
      </div>

      <div className="field">
        <label>รายชื่ออนามัย</label>
        <Select
          options={clinics.map(c => ({ label: c, value: c }))}
          onChange={(selected) => setForm(prev => ({ ...prev, clinic_name: selected.value }))}
          placeholder="-- ค้นหาหรือเลือกอนามัย --"
          isSearchable
          value={form.clinic_name ? { label: form.clinic_name, value: form.clinic_name } : null}
        />
      </div>

      <button type="submit">บันทึกข้อมูล</button>
    </form>
  );
}

export default ManualEntry;
