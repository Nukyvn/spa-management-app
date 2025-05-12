import { useState, useEffect } from "react";
import { getTechnicians, addTechnician } from "../utils/api";
import { toast } from "react-toastify";

function TechnicianManagement({ navigate }) {
  const [technicians, setTechnicians] = useState([]);
  const [newTechnician, setNewTechnician] = useState({ name: "", phone: "", address: "", cccd: "", level: "Cao cấp" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        console.log('Fetching technicians...');
        const response = await getTechnicians();
        console.log('Technicians response:', response.data);
        setTechnicians(response.data || []);
      } catch (err) {
        console.error('Error fetching technicians:', err);
        toast.error("Lỗi tải dữ liệu kỹ thuật viên: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  const handleAddTechnician = async () => {
    if (!newTechnician.name) {
      toast.error("Vui lòng nhập tên kỹ thuật viên!");
      return;
    }
    try {
      const response = await addTechnician(newTechnician);
      setTechnicians([...technicians, { ...newTechnician, id: response.data.id }]);
      setNewTechnician({ name: "", phone: "", address: "", cccd: "", level: "Cao cấp" });
      toast.success("Thêm kỹ thuật viên thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const formatNumber = (value) => {
    if (!value && value !== 0) return '';
    const num = Number(String(value).replace(/\D/g, '')) || 0;
    return num.toLocaleString('vi-VN');
  };

  if (loading) {
    return <div className="container my-5 text-center">Đang tải...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 display-5 fw-bold text-center text-primary">Quản Lý Kỹ Thuật Viên</h2>
      <div className="card p-4 mb-4 shadow-sm">
        <h3 className="mb-3 fs-4 text-primary">Thêm Kỹ Thuật Viên</h3>
        <label className="form-label fw-bold">Tên kỹ thuật viên</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập tên kỹ thuật viên"
          value={newTechnician.name}
          onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
        />
        <label className="form-label fw-bold">Số điện thoại</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập số điện thoại"
          value={newTechnician.phone}
          onChange={(e) => setNewTechnician({ ...newTechnician, phone: e.target.value })}
        />
        <label className="form-label fw-bold">Địa chỉ</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập địa chỉ"
          value={newTechnician.address}
          onChange={(e) => setNewTechnician({ ...newTechnician, address: e.target.value })}
        />
        <label className="form-label fw-bold">CCCD</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập số CCCD"
          value={newTechnician.cccd}
          onChange={(e) => setNewTechnician({ ...newTechnician, cccd: e.target.value })}
        />
        <label className="form-label fw-bold">Hạng kỹ thuật</label>
        <select
          className="form-select mb-3"
          value={newTechnician.level}
          onChange={(e) => setNewTechnician({ ...newTechnician, level: e.target.value })}
        >
          <option value="Cao cấp">Cao cấp</option>
          <option value="Trung cấp">Trung cấp</option>
          <option value="Sơ cấp">Sơ cấp</option>
        </select>
        <button
          onClick={handleAddTechnician}
          className="btn btn-success px-4 py-2"
        >
          <i className="bi bi-plus"></i> Thêm Kỹ Thuật Viên
        </button>
      </div>
      <div className="card p-4">
        <h3 className="mb-3 fs-4 text-primary">Danh Sách Kỹ Thuật Viên</h3>
        <table
          className="table table-bordered"
          data-toggle="table"
          data-pagination="true"
          data-search="true"
        >
          <thead>
            <tr>
              <th data-sortable="true">STT</th>
              <th data-sortable="true">Tên</th>
              <th data-sortable="true">Số điện thoại</th>
              <th data-sortable="true">Địa chỉ</th>
              <th data-sortable="true">CCCD</th>
              <th data-sortable="true">Hạng kỹ thuật</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((tech, index) => (
              <tr key={tech.id}>
                <td>{index + 1}</td>
                <td>{tech.name}</td>
                <td>{tech.phone}</td>
                <td>{tech.address}</td>
                <td>{tech.cccd}</td>
                <td>{tech.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TechnicianManagement;