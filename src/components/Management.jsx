import { useState, useEffect } from "react";
import { getServices, addService, updateService, deleteService } from "../utils/api";
import { toast } from "react-toastify";

function ManagementPage({ navigate }) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", description: "", price: 0, commission: 0 });
  const [editService, setEditService] = useState(null);

  useEffect(() => {
    getServices().then((res) => setServices(res.data)).catch((err) => {
      console.error(err);
      toast.error("Lỗi tải dữ liệu: " + err.message);
    });
  }, []);

  const handleAddService = async () => {
    if (!newService.name || !newService.price || !newService.commission) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const response = await addService(newService);
      setServices([...services, { ...newService, id: response.data.id }]);
      setNewService({ name: "", description: "", price: 0, commission: 0 });
      toast.success("Thêm dịch vụ thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleEditService = async () => {
    if (!editService.name || !editService.price || !editService.commission) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      await updateService(editService.id, editService);
      setServices(services.map((s) => (s.id === editService.id ? editService : s)));
      setEditService(null);
      toast.success("Cập nhật dịch vụ thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));
      toast.success("Xóa dịch vụ thành công!");
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
      <h2 className="mb-4 display-5 fw-bold text-center text-primary">Quản Lý Dịch Vụ</h2>
      <div className="card p-4 mb-4 shadow-sm">
        <h3 className="mb-3 fs-4 text-primary">{editService ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ"}</h3>
        <label className="form-label fw-bold">Tên dịch vụ</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập tên dịch vụ"
          value={editService ? editService.name : newService.name}
          onChange={(e) => {
            const value = e.target.value;
            editService
              ? setEditService({ ...editService, name: value })
              : setNewService({ ...newService, name: value });
          }}
        />
        <label className="form-label fw-bold">Mô tả</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập mô tả dịch vụ"
          value={editService ? editService.description : newService.description}
          onChange={(e) => {
            const value = e.target.value;
            editService
              ? setEditService({ ...editService, description: value })
              : setNewService({ ...newService, description: value });
          }}
        />
        <label className="form-label fw-bold">Giá (VNĐ)</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập giá dịch vụ"
          value={formatNumber(editService ? editService.price : newService.price)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            editService
              ? setEditService({ ...editService, price: value })
              : setNewService({ ...newService, price: value });
          }}
        />
        <label className="form-label fw-bold">Hoa hồng (%)</label>
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Nhập hoa hồng"
          value={editService ? editService.commission : newService.commission}
          onChange={(e) => {
            const value = e.target.value;
            editService
              ? setEditService({ ...editService, commission: value })
              : setNewService({ ...newService, commission: value });
          }}
        />
        <button
          onClick={editService ? handleEditService : handleAddService}
          className="btn btn-success px-4 py-2"
        >
          <i className="bi bi-plus"></i> {editService ? "Cập Nhật Dịch Vụ" : "Thêm Dịch Vụ"}
        </button>
        {editService && (
          <button
            onClick={() => setEditService(null)}
            className="btn btn-secondary ms-2 px-4 py-2"
          >
            <i className="bi bi-x"></i> Hủy
          </button>
        )}
      </div>
      <div className="card p-4">
        <h3 className="mb-3 fs-4 text-primary">Danh Sách Dịch Vụ</h3>
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
              <th data-sortable="true">Mô tả</th>
              <th data-sortable="true">Giá (VNĐ)</th>
              <th data-sortable="true">Hoa hồng (%)</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id}>
                <td>{index + 1}</td>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>{formatNumber(service.price)}</td>
                <td>{(service.commission * 100).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => setEditService(service)}
                    className="btn btn-primary btn-sm me-2"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
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

export default ManagementPage;