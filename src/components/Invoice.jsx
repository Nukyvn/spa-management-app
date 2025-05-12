function Invoice({ cart, customer, total, pointsUsed, discount, technicians }) {
    const formatNumber = (value) => {
      if (!value && value !== 0) return '0';
      const num = Number(String(value).replace(/\D/g, '')) || 0;
      return num.toLocaleString('vi-VN');
    };
  
    return (
      <div className="container p-4">
        <table className="table table-bordered mb-4">
          <thead>
            <tr>
              <th>Dịch vụ</th>
              <th className="text-end">Số lượng</th>
              <th className="text-end">Giá</th>
              <th>Kỹ thuật viên</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{formatNumber(item.price * item.quantity)} VNĐ</td>
                <td>{technicians.find((t) => t.id === parseInt(item.technician_id))?.name || "Chưa chọn"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end">
          <p><strong>Tổng cộng:</strong> {formatNumber(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))} VNĐ</p>
          <p><strong>Khuyến mãi:</strong> {formatNumber(discount)} VNĐ</p>
          <p><strong>Điểm sử dụng:</strong> {pointsUsed} (={formatNumber(pointsUsed * 1000)} VNĐ)</p>
          <p className="fs-5 fw-bold"><strong>Thành tiền:</strong> {formatNumber(total)} VNĐ</p>
          <p><strong>Khách hàng:</strong> {customer?.name || "Khách vãng lai"}</p>
          <p><strong>Ngày:</strong> {new Date().toLocaleDateString("vi-VN")}</p>
        </div>
      </div>
    );
  }
  
  export default Invoice;