import { useState, useEffect, useRef } from "react";
import { getServices, getCustomers, createTransaction, addCustomer, getTechnicians, updateCustomer } from "../utils/api";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import Select from "react-select";
import Invoice from "./Invoice";

function BillingPage({ navigate }) {
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [discount, setDiscount] = useState({ type: "percent", value: 0 });
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", membership_type: "Normal" });
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [printSize, setPrintSize] = useState("K80");
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching services, customers, and technicians...');
        const [servicesRes, customersRes, techniciansRes] = await Promise.all([
          getServices(),
          getCustomers(),
          getTechnicians().catch((err) => {
            console.error('Error fetching technicians:', err);
            return { data: [] }; // Trả về mảng rỗng nếu lỗi
          }),
        ]);
        console.log('Services response:', servicesRes.data);
        console.log('Customers response:', customersRes.data);
        console.log('Technicians response:', techniciansRes.data);
        setServices(servicesRes.data || []);
        setCustomers(customersRes.data || []);
        setTechnicians(techniciansRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error("Lỗi tải dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (service) => {
    const existing = cart.find((item) => item.id === service.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...service, quantity: 1, technician_id: "" }]);
    }
  };

  const updateCartTechnician = (id, technician_id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, technician_id } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discount.type === "percent") {
      return (subtotal * discount.value) / 100;
    }
    return discount.value;
  };

  const total = calculateSubtotal() - calculateDiscount() - pointsUsed * 1000;

  const handleAddCustomer = async () => {
    if (!newCustomer.name) {
      toast.error("Vui lòng nhập tên khách hàng!");
      return;
    }
    try {
      const response = await addCustomer(newCustomer);
      const newCust = { ...newCustomer, id: response.data.id, points: 0 };
      setCustomers([...customers, newCust]);
      setSelectedCustomer(newCust);
      setNewCustomer({ name: "", phone: "", membership_type: "Normal" });
      setShowNewCustomerForm(false);
      toast.success("Thêm khách hàng thành công!");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleCheckout = async () => {
    if (!cart.length) {
      toast.error("Giỏ hàng trống!");
      return;
    }
    try {
      for (const item of cart) {
        if (!item.technician_id) {
          toast.error("Vui lòng chọn kỹ thuật viên cho tất cả dịch vụ!");
          return;
        }
        await createTransaction({
          customer_id: selectedCustomer?.id || null,
          service_id: item.id,
          technician_id: item.technician_id,
          amount: item.price * item.quantity,
          points_used: pointsUsed / cart.length,
        });
      }
      if (selectedCustomer && pointsUsed > 0) {
        const newPoints = selectedCustomer.points - pointsUsed;
        await updateCustomer(selectedCustomer.id, { ...selectedCustomer, points: newPoints });
        setCustomers(
          customers.map((c) =>
            c.id === selectedCustomer.id ? { ...c, points: newPoints } : c
          )
        );
        setSelectedCustomer({ ...selectedCustomer, points: newPoints });
      }
      toast.success("Thanh toán thành công!");
      setShowInvoice(true);
    } catch (error) {
      toast.error("Lỗi thanh toán: " + error.message);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: "Hóa đơn Spa",
    pageStyle: printSize === "K80" ? `
      @media print {
        @page {
          size: 80mm auto;
          margin: 5mm;
        }
        body {
          width: 80mm;
          font-size: 12px;
        }
      }
    ` : `
      @media print {
        @page {
          size: 58mm auto;
          margin: 5mm;
        }
        body {
          width: 58mm;
          font-size: 10px;
        }
      }
    `,
  });

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
      <h2 className="mb-4 display-5 fw-bold text-center text-primary">Tính Tiền</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm">
            <h3 className="mb-3 fs-4 text-primary">Danh Sách Dịch Vụ</h3>
            <Select
              options={services.map((s) => ({ value: s.id, label: s.name }))}
              onChange={(selected) => {
                const service = services.find((s) => s.id === selected.value);
                addToCart(service);
              }}
              placeholder="Tìm kiếm dịch vụ..."
              className="mb-3"
            />
            <div className="row">
              {services.map((service) => (
                <div key={service.id} className="col-md-6 mb-3">
                  <div className="card p-3 text-center bg-light border-0 shadow-sm" style={{ cursor: "pointer" }} onClick={() => addToCart(service)}>
                    <h4 className="fs-6 fw-bold text-dark">{service.name}</h4>
                    <p className="text-muted small">{service.description}</p>
                    <p className="fw-bold text-primary">{formatNumber(service.price)} VNĐ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm">
            <h3 className="mb-3 fs-4 text-primary">Hóa Đơn</h3>
            <div className="mb-3">
              <label className="form-label fw-bold">Khách hàng</label>
              <select
                className="form-select"
                value={selectedCustomer?.id || ""}
                onChange={(e) => {
                  const customer = customers.find((c) => c.id === parseInt(e.target.value));
                  setSelectedCustomer(customer);
                }}
              >
                <option value="">Chọn khách hàng</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} (Điểm: {customer.points}, {customer.membership_type})
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-primary mb-3"
              onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
            >
              <i className="bi bi-person-plus"></i> {showNewCustomerForm ? "Ẩn Form" : "Thêm Khách Hàng Mới"}
            </button>
            {showNewCustomerForm && (
              <div className="mb-3">
                <label className="form-label">Tên khách hàng</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên khách hàng"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
                <label className="form-label mt-2">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập số điện thoại"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
                <label className="form-label mt-2">Loại thành viên</label>
                <select
                  className="form-select"
                  value={newCustomer.membership_type}
                  onChange={(e) => setNewCustomer({ ...newCustomer, membership_type: e.target.value })}
                >
                  <option value="Normal">Normal</option>
                  <option value="VIP">VIP</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                </select>
                <button
                  className="btn btn-success mt-3"
                  onClick={handleAddCustomer}
                >
                  <i className="bi bi-plus"></i> Thêm Khách Hàng
                </button>
              </div>
            )}
            <h4 className="mt-4 mb-3 fs-5 fw-bold">Giỏ Hàng</h4>
            {cart.length === 0 ? (
              <p className="text-muted">Chưa có dịch vụ nào trong giỏ.</p>
            ) : (
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Dịch vụ</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                      <th>Kỹ thuật viên</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatNumber(item.price * item.quantity)} VNĐ</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={item.technician_id}
                            onChange={(e) => updateCartTechnician(item.id, e.target.value)}
                          >
                            <option value="">Chọn kỹ thuật viên</option>
                            {technicians.map((tech) => (
                              <option key={tech.id} value={tech.id}>{tech.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-3">
              <label className="form-label fw-bold">Sử dụng điểm</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập số điểm sử dụng"
                value={formatNumber(pointsUsed)}
                onChange={(e) => setPointsUsed(Math.min(e.target.value.replace(/\D/g, ''), selectedCustomer?.points || 0))}
              />
            </div>
            <div className="mt-3">
              <label className="form-label fw-bold">Khuyến mãi</label>
              <div className="input-group">
                <select
                  className="form-select"
                  value={discount.type}
                  onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
                >
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền (VNĐ)</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập giá trị khuyến mãi"
                  value={formatNumber(discount.value)}
                  onChange={(e) => setDiscount({ ...discount, value: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>
            <div className="mt-4 text-end">
              <p><strong>Tổng cộng:</strong> {formatNumber(calculateSubtotal())} VNĐ</p>
              <p><strong>Khuyến mãi:</strong> {formatNumber(calculateDiscount())} VNĐ</p>
              <p><strong>Điểm sử dụng:</strong> {formatNumber(pointsUsed * 1000)} VNĐ</p>
              <p className="fs-4 fw-bold text-primary">
                <strong>Thành tiền:</strong> {formatNumber(total)} VNĐ
              </p>
              <button
                onClick={handleCheckout}
                className="btn btn-success me-2 px-4 py-2"
              >
                <i className="bi bi-check-circle"></i> Thanh Toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {showInvoice && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Phiếu Thanh Toán</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowInvoice(false);
                    setCart([]);
                    setPointsUsed(0);
                    setSelectedCustomer(null);
                    setDiscount({ type: "percent", value: 0 });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div ref={invoiceRef}>
                  <div className="text-center mb-3">
                    <img src="/logo.png" alt="Logo Spa" style={{ maxWidth: "150px" }} />
                    <h4 className="fw-bold">Spa Thư Giãn</h4>
                    <p>Địa chỉ: 123 Đường Láng, Hà Nội</p>
                    <p>Hotline: 0123 456 789</p>
                  </div>
                  <Invoice
                    cart={cart}
                    customer={selectedCustomer}
                    total={total}
                    pointsUsed={pointsUsed}
                    discount={calculateDiscount()}
                    technicians={technicians}
                  />
                  <div className="text-center mt-3">
                    <p className="fst-italic">Cảm ơn quý khách đã sử dụng dịch vụ!</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <select
                  className="form-select me-2"
                  value={printSize}
                  onChange={(e) => setPrintSize(e.target.value)}
                >
                  <option value="K80">K80 (80mm)</option>
                  <option value="K58">K58 (58mm)</option>
                </select>
                <button
                  onClick={handlePrint}
                  className="btn btn-primary"
                >
                  <i className="bi bi-printer"></i> In Hóa Đơn
                </button>
                <button
                  onClick={() => {
                    setShowInvoice(false);
                    setCart([]);
                    setPointsUsed(0);
                    setSelectedCustomer(null);
                    setDiscount({ type: "percent", value: 0 });
                  }}
                  className="btn btn-secondary"
                >
                  <i className="bi bi-x"></i> Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingPage;