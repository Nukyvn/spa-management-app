import { useState, useEffect } from "react";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../utils/api";
import { toast } from "react-toastify";

function CustomerManagement({ navigate }) {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", membership_type: "Normal", points: 0 });
  const [editCustomer, setEditCustomer] = useState(null);

  useEffect(() => {
    getCustomers().then((res) => setCustomers(res.data)).catch((err) => {
      console.error(err);
      toast.error("Lỗi tải dữ liệu: " + err.message);
    });
  }, []);

  const handleAddCustomer = async () => {
    if (!newCustomer.name) {
      toast.error("Vui lòng nhập tên khách hàng!");
      return;
    }
    try {
      const response = await addCustomer(newCustomer);
      setCustomers([...customers, { ...newCustomer, id: response.data.id }]);
      setNewCustomer({ name: "", phone: "", membership_type: "Normal", points: 0 });
      toast.success("Thêm khách hàng thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleEditCustomer = async () => {
    if (!editCustomer.name) {
      toast.error("Vui lòng nhập tên khách hàng!");
      return;
    }
    try {
      await updateCustomer(editCustomer.id, editCustomer);
      setCustomers(customers.map((c) => (c.id === editCustomer.id ? editCustomer : c)));
      setEditCustomer(null);
      toast.success("Cập nhật khách hàng thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((c) => c.id !== id));
      toast.success("Xóa khách hàng thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const formatNumber = (value) => {
    if (!value && value !== 0) return '';
    const num = Number(String(value).replace(/\D/g, '')) || 0;
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 display-5 fw-bold">Quản Lý Khách Hàng</h2>
      <div className="card p-4 mb-4">
        <h3 className="mb-3 fs-4">{editCustomer ? "Sửa Khách Hàng" : "Thêm Khách Hàng"}</h3>
        <label className="form-label">Tên khách hàng</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập tên khách hàng"
          value={editCustomer ? editCustomer.name : newCustomer.name}
          onChange={(e) => {
            const value = e.target.value;
            editCustomer
              ? setEditCustomer({ ...editCustomer, name: value })
              : setNewCustomer({ ...newCustomer, name: value });
          }}
        />
        <label className="form-label">Số điện thoại</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập số điện thoại"
          value={editCustomer ? editCustomer.phone : newCustomer.phone}
          onChange={(e) => {
            const value = e.target.value;
            editCustomer
              ? setEditCustomer({ ...editCustomer, phone: value })
              : setNewCustomer({ ...newCustomer, phone: value });
          }}
        />
        <label className="form-label">Loại thành viên</label>
        <select
          className="form-select mb-3"
          value={editCustomer ? editCustomer.membership_type : newCustomer.membership_type}
          onChange={(e) => {
            const value = e.target.value;
            editCustomer
              ? setEditCustomer({ ...editCustomer, membership_type: value })
              : setNewCustomer({ ...newCustomer, membership_type: value });
          }}
        >
          <option value="Normal">Normal</option>
          <option value="VIP">VIP</option>
          <option value="Platinum">Platinum</option>
          <option value="Gold">Gold</option>
        </select>
        <label className="form-label">Điểm</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập điểm tích lũy"
          value={formatNumber(editCustomer ? editCustomer.points : newCustomer.points)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            editCustomer
              ? setEditCustomer({ ...editCustomer, points: value })
              : setNewCustomer({ ...newCustomer, points: value });
          }}
        />
        <button
          onClick={editCustomer ? handleEditCustomer : handleAddCustomer}
          className="btn btn-success px-4 py-2"
        >
          <i className="bi bi-plus"></i> {editCustomer ? "Cập Nhật Khách Hàng" : "Thêm Khách Hàng"}
        </button>
        {editCustomer && (
          <button
            onClick={() => setEditCustomer(null)}
            className="btn btn-secondary ms-2 px-4 py-2"
          >
            <i className="bi bi-x"></i> Hủy
          </button>
        )}
      </div>
      <div className="card p-4">
        <h3 className="mb-3 fs-4">Danh Sách Khách Hàng</h3>
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
              <th data-sortable="true">Điểm</th>
              <th data-sortable="true">Loại thành viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{formatNumber(customer.points)}</td>
                <td>{customer.membership_type}</td>
                <td>
                  <button
                    onClick={() => setEditCustomer(customer)}
                    className="btn btn-primary btn-sm me-2"
                  >
                    <i className="bi bi-pencil"></i> Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerManagement;