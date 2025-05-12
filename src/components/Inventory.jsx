import { useState, useEffect } from "react";
import { getInventory, addInventory, updateInventory, deleteInventory } from "../utils/api";
import { toast } from "react-toastify";

function InventoryPage({ navigate }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", type: "tool", quantity: 0, unit_price: 0, cost: 0, supplier: "" });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    getInventory().then((res) => setItems(res.data)).catch((err) => {
      console.error(err);
      toast.error("Lỗi tải dữ liệu: " + err.message);
    });
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.unit_price) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const cost = newItem.quantity * newItem.unit_price;
    const itemToAdd = { ...newItem, cost };
    try {
      const response = await addInventory(itemToAdd);
      setItems([...items, { ...itemToAdd, id: response.data.id, created_at: new Date().toISOString() }]);
      setNewItem({ name: "", type: "tool", quantity: 0, unit_price: 0, cost: 0, supplier: "" });
      toast.success("Thêm vật phẩm thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleEditItem = async () => {
    if (!editItem.name || !editItem.quantity || !editItem.unit_price) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const cost = editItem.quantity * editItem.unit_price;
    const itemToUpdate = { ...editItem, cost };
    try {
      await updateInventory(editItem.id, itemToUpdate);
      setItems(items.map((i) => (i.id === editItem.id ? itemToUpdate : i)));
      setEditItem(null);
      toast.success("Cập nhật vật phẩm thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa vật phẩm này?")) return;
    try {
      await deleteInventory(id);
      setItems(items.filter((i) => i.id !== id));
      toast.success("Xóa vật phẩm thành công!");
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
      <h2 className="mb-4 display-5 fw-bold">Nhập Hàng</h2>
      <div className="card p-4 mb-4">
        <h3 className="mb-3 fs-4">{editItem ? "Sửa Vật Phẩm" : "Thêm Vật Phẩm"}</h3>
        <label className="form-label">Tên vật phẩm</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập tên vật phẩm"
          value={editItem ? editItem.name : newItem.name}
          onChange={(e) => {
            const value = e.target.value;
            editItem
              ? setEditItem({ ...editItem, name: value })
              : setNewItem({ ...newItem, name: value });
          }}
        />
        <label className="form-label">Loại</label>
        <select
          className="form-select mb-3"
          value={editItem ? editItem.type : newItem.type}
          onChange={(e) => {
            const value = e.target.value;
            editItem
              ? setEditItem({ ...editItem, type: value })
              : setNewItem({ ...newItem, type: value });
          }}
        >
          <option value="tool">Công cụ</option>
          <option value="material">Nguyên liệu</option>
        </select>
        <label className="form-label">Số lượng</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập số lượng"
          value={formatNumber(editItem ? editItem.quantity : newItem.quantity)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            editItem
              ? setEditItem({ ...editItem, quantity: value })
              : setNewItem({ ...newItem, quantity: value });
          }}
        />
        <label className="form-label">Đơn giá (VNĐ)</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập đơn giá"
          value={formatNumber(editItem ? editItem.unit_price : newItem.unit_price)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            editItem
              ? setEditItem({ ...editItem, unit_price: value })
              : setNewItem({ ...newItem, unit_price: value });
          }}
        />
        <label className="form-label">Thành tiền (VNĐ)</label>
        <input
          type="text"
          className="form-control mb-3"
          value={formatNumber((editItem ? editItem.quantity : newItem.quantity) * (editItem ? editItem.unit_price : newItem.unit_price))}
          readOnly
        />
        <label className="form-label">Nhà cung cấp</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập tên nhà cung cấp"
          value={editItem ? editItem.supplier : newItem.supplier}
          onChange={(e) => {
            const value = e.target.value;
            editItem
              ? setEditItem({ ...editItem, supplier: value })
              : setNewItem({ ...newItem, supplier: value });
          }}
        />
        <button
          onClick={editItem ? handleEditItem : handleAddItem}
          className="btn btn-success px-4 py-2"
        >
          <i className="bi bi-plus"></i> {editItem ? "Cập Nhật Vật Phẩm" : "Thêm Vật Phẩm"}
        </button>
        {editItem && (
          <button
            onClick={() => setEditItem(null)}
            className="btn btn-secondary ms-2 px-4 py-2"
          >
            <i className="bi bi-x"></i> Hủy
          </button>
        )}
      </div>
      <div className="card p-4">
        <h3 className="mb-3 fs-4">Danh Sách Kho</h3>
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
              <th data-sortable="true">Loại</th>
              <th data-sortable="true">Số lượng</th>
              <th data-sortable="true">Đơn giá (VNĐ)</th>
              <th data-sortable="true">Thành tiền (VNĐ)</th>
              <th data-sortable="true">Nhà cung cấp</th>
              <th data-sortable="true">Ngày nhập</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.type === "tool" ? "Công cụ" : "Nguyên liệu"}</td>
                <td>{item.quantity}</td>
                <td>{formatNumber(item.unit_price)}</td>
                <td>{formatNumber(item.cost)}</td>
                <td>{item.supplier}</td>
                <td>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button
                    onClick={() => setEditItem(item)}
                    className="btn btn-primary btn-sm me-2"
                  >
                    <i className="bi bi-pencil"></i> Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
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

export default InventoryPage;