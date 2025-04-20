import React, { useState, useEffect } from 'react';

import * as XLSX from 'xlsx';



const cellStyle = {

  padding: "6px",

  border: "1px solid #ccc",

  textAlign: "center",

  fontSize: "11px",

  wordBreak: "break-word"

};



function SearchPage() {

  const [citizenId, setCitizenId] = useState('');

  const [fullname, setFullname] = useState('');

  const [fromDate, setFromDate] = useState('');

  const [toDate, setToDate] = useState('');

  const [results, setResults] = useState([]);

  const [filteredResults, setFilteredResults] = useState([]);

  const [message, setMessage] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');

  const [username, setUsername] = useState('');






  const handleSearch = async (e) => {

    e.preventDefault();

    setMessage('');

    setResults([]);



    try {

      const baseURL = `${window.location.origin}/project/backend`;



const res = await fetch(`${baseURL}/search_range.php`, {

  method: 'POST',

  headers: { 'Content-Type': 'application/json' },

  body: JSON.stringify({

    citizen_id: citizenId,

    from_date: fromDate,

    to_date: toDate

  })

});





      const data = await res.json();



      if (data.success && data.records) {

        setResults(data.records);

        setFullname(data.fullname || '');



      } else {

        setMessage(data.message || 'ไม่พบข้อมูล');

        setFullname('');

      }

    } catch (error) {

      setMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');

    }

  };



  const handlePrint = () => {

    const printContents = document.getElementById('print-section').innerHTML;

    const w = window.open('', '', 'width=1200,height=800');

    w.document.write('<html><head><title>พิมพ์รายงาน</title>');

    w.document.write('<style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 4px; font-size: 11px; } input { border: none; width: 100%; text-align: center; }</style>');

    w.document.write('</head><body>');

    w.document.write(`<div style="text-align:center;font-weight:bold;">สรุปรายงาน</div>`);

    w.document.write(printContents); // ✅ ข้อมูลบัตร ปชช./ชื่อ อยู่ใน print-section แล้ว ไม่ต้องซ้ำ

    w.document.write(`<div style="position:fixed; bottom:5px; left:5px; font-size:10px;">ผู้ใช้: ${username}</div>`);

    w.document.write('</body></html>');

    w.document.close();

    w.print();

  };



  const exportToExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(filteredResults);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    XLSX.writeFile(workbook, 'report.xlsx');

  };



  const filterResults = () => {

    let filtered = [...results];

    if (statusFilter !== 'all') {

      filtered = filtered.filter(r => r.status === statusFilter);

    }

    setFilteredResults(filtered);

  };



  const formatThaiDate = (dateStr) => {

    const date = new Date(dateStr);

    const day = date.getDate();

    const month = date.getMonth() + 1;

    const year = date.getFullYear() + 543;

    return `${day}/${month}/${year}`;

  };



  return (

    <form className="card" onSubmit={handleSearch} style={{ maxWidth: '1000px', margin: 'auto' }}>

      <h2>สรุปรายงาน</h2>



      <div className="field">

        <label>เลขบัตรประชาชน</label>

        <input type="text" value={citizenId} onChange={(e) => setCitizenId(e.target.value)} required />

      </div>



      <div className="field">

        <label>ตั้งแต่วันที่</label>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />

      </div>



      <div className="field">

        <label>ถึงวันที่</label>

        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />

      </div>



      <div className="field">

        <label>สถานะ</label>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>

          <option value="all">ทั้งหมด</option>

          <option value="มาตามนัด">มาตามนัด</option>

          <option value="❌ ไม่มา">❌ ไม่มา</option>

        </select>

      </div>



      <button type="submit">ค้นหา</button>



      {message && <p className="message error">{message}</p>}



      {filteredResults.length > 0 && (

        <>

          <button type="button" onClick={handlePrint} style={{ marginTop: 15, marginRight: 10 }}>

            🖨️ พิมพ์รายงาน

          </button>

          <button type="button" onClick={exportToExcel} style={{ marginTop: 15 }}>

            📥 Export Excel

          </button>



          <div id="print-section" className="result-box" style={{ background: "#fcffe6", border: "1px solid #c4e36a", padding: "15px", borderRadius: "10px", marginTop: "10px", overflowX: "auto" }}>

            <div style={{ marginBottom: 8 }}>

              <strong>เลขบัตรประชาชน:</strong> {citizenId} <br />

              <strong>ชื่อเต็ม:</strong> {fullname}

            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>

              <thead style={{ background: "#e8f5c8" }}>

                <tr>

                  <th style={cellStyle}>วันนัด</th>

                  <th style={cellStyle}>สถานะ</th>

                  <th style={cellStyle}>ชื่อยา</th>

                  <th style={cellStyle}>ขนาดยา</th>

                  <th style={cellStyle}>ตำแหน่ง</th>

                  <th style={cellStyle}>สถานที่</th>

                  <th style={cellStyle}>ลายเซ็น</th>

                </tr>

              </thead>

              <tbody>

                {filteredResults.map((item, idx) => (

                  <tr key={idx}>

                    <td style={cellStyle}>{formatThaiDate(item.appointment_date)}</td>

                    <td style={{ ...cellStyle, color: item.status.includes("มาตามนัด") ? "green" : "red", fontWeight: "bold" }}>{item.status}</td>

                    <td style={cellStyle}>{item.drug_name || "-"}</td>

                    <td style={cellStyle}>{item.dose || "-"}</td>

                    <td style={cellStyle}>{item.position || "-"}</td>

                    <td style={cellStyle}>{item.clinic_name || "-"}</td>

                    <td style={cellStyle}>{item.signature || "-"}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </>

      )}

    </form>

  );

}



export default SearchPage;

