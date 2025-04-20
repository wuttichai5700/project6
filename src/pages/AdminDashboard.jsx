import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/sb-admin-2.min.css';

import * as XLSX from 'xlsx';



function AdminDashboard() {

  const [stats, setStats] = useState({ total: 0, missed: 0, attended: 0 });

  const [pendingUsers, setPendingUsers] = useState([]);

  const [filterStatus, setFilterStatus] = useState('all');



  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [missedList, setMissedList] = useState([]);



  const baseURL = `${window.location.origin}/project/backend`;



  const fetchStats = async () => {

    let url = `${baseURL}/dashboard_stats.php`;

    if (startDate && endDate) {

      url += `?start=${startDate}&end=${endDate}&status=${filterStatus}`;

    }

    const res = await fetch(url);

    const data = await res.json();

    setStats(data);

  };

  

  const fetchMissedList = async () => {

    if (startDate && endDate) {

      const res = await fetch(`${baseURL}/missed_list.php?start=${startDate}&end=${endDate}`);

      const data = await res.json();

      setMissedList(data);

    }

  };

  



const fetchPending = async () => {

  const res = await fetch(`${baseURL}/pending_users.php`);

  const data = await res.json();

  setPendingUsers(data);

};



const approveUser = async (username) => {

  const res = await fetch(`${baseURL}/approve_user.php`, {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({ username })

  });

  const result = await res.json();

  if (result.success) {

    alert('✅ อนุมัติผู้ใช้แล้ว');

    fetchPending();

  }

};





  const handleExport = () => {

    const ws = XLSX.utils.json_to_sheet(missedList);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Missed List');

    XLSX.writeFile(wb, 'missed_list_export.xlsx');

  };



  


  return (

    <div className="container-fluid px-4">

  <div className="d-flex justify-content-end gap-2 mb-3">

    <button className="btn btn-secondary" onClick={() => window.location.href = "/appt/"}>

      ⬅️ กลับหน้าหลัก

    </button>

  </div>







      <h1 className="mt-4">Dashboard</h1>



      <div className="row mb-3">

        <div className="col-md-3">

          <label>จากวันที่:</label>

          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        </div>

        <div className="col-md-3">

          <label>ถึงวันที่:</label>

          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        </div>

        <div className="col-md-3">

          <label>กรองสถานะ:</label>

          <select className="form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>

            <option value="all">ทั้งหมด</option>

            <option value="attended">มาตามนัด</option>

            <option value="missed">ไม่มา</option>

          </select>

        </div>

        <div className="col-md-3 d-flex align-items-end">

          <button className="btn btn-outline-success" onClick={handleExport}>📥 Export Excel</button>

        </div>

      </div>



      <div className="row my-4">

        <div className="col-xl-4 col-md-6 mb-4">

          <div className="card border-left-danger shadow h-100 py-2">

            <div className="card-body">

              <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">ไม่มา</div>

              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.missed}</div>

            </div>

          </div>

        </div>

        <div className="col-xl-4 col-md-6 mb-4">

          <div className="card border-left-success shadow h-100 py-2">

            <div className="card-body">

              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">มาตามนัด</div>

              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.attended}</div>

            </div>

          </div>

        </div>

        <div className="col-xl-4 col-md-6 mb-4">

          <div className="card border-left-primary shadow h-100 py-2">

            <div className="card-body">

              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">รวมทั้งหมด</div>

              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.total}</div>

            </div>

          </div>

        </div>

      </div>



      <div className="card shadow mb-4">

  <div className="card-header py-3">

    <h6 className="m-0 font-weight-bold text-danger">ผู้ที่ยังไม่มาฉีดยา</h6>

  </div>

  <div className="card-body">

    <div className="table-responsive">

      <table className="table table-bordered">

        <thead>

          <tr>

            <th>ชื่อ - นามสกุล</th>

            <th>วันที่นัดฉีดยา</th>

            <th>เบอร์โทร</th> {/* ✅ เพิ่มหัวข้อ */}

          </tr>

        </thead>

        <tbody>

          {missedList.length === 0 ? (

            <tr><td colSpan="3" className="text-center">ไม่มีรายการ</td></tr>

          ) : (

            missedList.map((item, idx) => (

              <tr key={idx}>

                <td>{item.fullname}</td>

                <td>{item.appointment_date}</td>

                <td>{item.phone || '-'}</td> {/* ✅ แสดงเบอร์โทร */}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>





      <div className="card shadow mb-4">

        <div className="card-header py-3">

          <h6 className="m-0 font-weight-bold text-primary">ผู้ใช้ที่รออนุมัติ</h6>

        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered">

              <thead>

                <tr>

                  <th>ชื่อผู้ใช้</th>

                  <th>การอนุมัติ</th>

                </tr>

              </thead>

              <tbody>

                {pendingUsers.length === 0 ? (

                  <tr><td colSpan="2" className="text-center">ไม่มีรายการ</td></tr>

                ) : (

                  pendingUsers.map((user, idx) => (

                    <tr key={idx}>

                      <td>{user.username}</td>

                      <td>

                        <button className="btn btn-success btn-sm" onClick={() => approveUser(user.username)}>

                          ✅ อนุมัติ

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}



export default AdminDashboard;