import { useState, useEffect } from "react";
import { getRevenueReport, getCashFlow, getTechnicianCommissions } from "../utils/api";

function ReportPage({ navigate }) {
  const [revenueReports, setRevenueReports] = useState([]);
  const [cashFlow, setCashFlow] = useState([]);
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    getRevenueReport().then((res) => setRevenueReports(res.data)).catch((err) => console.error(err));
    getCashFlow().then((res) => setCashFlow(res.data)).catch((err) => console.error(err));
    getTechnicianCommissions().then((res) => setCommissions(res.data)).catch((err) => console.error(err));
  }, []);

  const formatNumber = (value) => {
    if (!value && value !== 0) return '';
    const num = Number(String(value).replace(/\D/g, '')) || 0;
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 display-5 fw-bold">Báo Cáo</h2>
      <div className="card p-4 mb-4">
        <h3 className="mb-3 fs-4"><i className="bi bi-bar-chart"></i> Doanh Thu Theo Ngày</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ngày</th>
              <th className="text-end">Tổng Doanh Thu</th>
            </tr>
          </thead>
          <tbody>
            {revenueReports.map((report, index) => (
              <tr key={index}>
                <td>{report.date}</td>
                <td className="text-end">{formatNumber(report.total)} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card p-4 mb-4">
        <h3 className="mb-3 fs-4"><i className="bi bi-wallet"></i> Sổ Quỹ Thu Chi</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Loại</th>
              <th className="text-end">Số Tiền</th>
              <th>Mô Tả</th>
            </tr>
          </thead>
          <tbody>
            {cashFlow.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.created_at).toLocaleDateString("vi-VN")}</td>
                <td>{entry.type === "receipt" ? "Thu" : "Chi"}</td>
                <td className="text-end">{formatNumber(entry.amount)} VNĐ</td>
                <td>{entry.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card p-4">
        <h3 className="mb-3 fs-4"><i className="bi bi-person-gear"></i> Hoa Hồng Kỹ Thuật Viên</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Kỹ Thuật Viên</th>
              <th className="text-end">Tổng Hoa Hồng</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{commission.technician_name}</td>
                <td className="text-end">{formatNumber(commission.total_commission)} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportPage;