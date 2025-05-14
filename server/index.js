import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

// Cấu hình CORS
app.use(cors({
  origin: ["http://localhost:5173"], // Cho phép origin của frontend cục bộ
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// API lấy danh sách kỹ thuật viên
app.get("/api/technicians", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM technicians");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // API thêm kỹ thuật viên
  app.post("/api/technicians", async (req, res) => {
    const { name, phone, address, cccd, level } = req.body;
    try {
      const [result] = await pool.query(
        "INSERT INTO technicians (name, phone, address, cccd, level) VALUES (?, ?, ?, ?, ?)",
        [name, phone, address, cccd, level]
      );
      res.json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// API lấy danh sách dịch vụ
app.get("/api/services", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM services");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API thêm dịch vụ
app.post("/api/services", async (req, res) => {
  const { name, description, price, commission } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO services (name, description, price, commission) VALUES (?, ?, ?, ?)",
      [name, description, price, commission]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API sửa dịch vụ
app.put("/api/services/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, commission } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE services SET name = ?, description = ?, price = ?, commission = ? WHERE id = ?",
      [name, description, price, commission, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Dịch vụ không tồn tại" });
    }
    res.json({ message: "Cập nhật dịch vụ thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API xóa dịch vụ
app.delete("/api/services/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM services WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Dịch vụ không tồn tại" });
    }
    res.json({ message: "Xóa dịch vụ thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API lấy danh sách khách hàng
app.get("/api/customers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API thêm khách hàng
app.post("/api/customers", async (req, res) => {
  const { name, phone, membership_type, points } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO customers (name, phone, membership_type, points) VALUES (?, ?, ?, ?)",
      [name, phone, membership_type, points || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API sửa khách hàng
app.put("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, membership_type, points } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE customers SET name = ?, phone = ?, membership_type = ?, points = ? WHERE id = ?",
      [name, phone, membership_type, points, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }
    res.json({ message: "Cập nhật khách hàng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API xóa khách hàng
app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM customers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }
    res.json({ message: "Xóa khách hàng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API thêm giao dịch
app.post("/api/transactions", async (req, res) => {
  const { customer_id, service_id, technician_id, amount, points_used } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO transactions (customer_id, service_id, technician_id, amount, points_used) VALUES (?, ?, ?, ?, ?)",
      [customer_id, service_id, technician_id, amount, points_used]
    );
    await pool.query("INSERT INTO cash_flow (type, amount, description) VALUES (?, ?, ?)", [
      "receipt",
      amount,
      `Thanh toán đơn hàng #${result.insertId}`,
    ]);
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API lấy danh sách lịch hẹn
app.get("/api/appointments", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM appointments");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API thêm lịch hẹn
app.post("/api/appointments", async (req, res) => {
  const { customer_id, service_id, technician_id, start_time } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO appointments (customer_id, service_id, technician_id, start_time) VALUES (?, ?, ?, ?)",
      [customer_id, service_id, technician_id, start_time]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API sửa lịch hẹn
app.put("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { customer_id, service_id, technician_id, start_time, completed } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE appointments SET customer_id = ?, service_id = ?, technician_id = ?, start_time = ?, completed = ? WHERE id = ?",
      [customer_id, service_id, technician_id, start_time, completed, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lịch hẹn không tồn tại" });
    }
    res.json({ message: "Cập nhật lịch hẹn thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API xóa lịch hẹn
app.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM appointments WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lịch hẹn không tồn tại" });
    }
    res.json({ message: "Xóa lịch hẹn thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API lấy danh sách kho
app.get("/api/inventory", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inventory");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API thêm vật phẩm kho
app.post("/api/inventory", async (req, res) => {
  const { name, type, quantity, unit_price, cost, supplier } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO inventory (name, type, quantity, unit_price, cost, supplier) VALUES (?, ?, ?, ?, ?, ?)",
      [name, type, quantity, unit_price, cost, supplier]
    );
    await pool.query("INSERT INTO cash_flow (type, amount, description) VALUES (?, ?, ?)", [
      "expense",
      cost,
      `Nhập hàng: ${name}`,
    ]);
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API sửa vật phẩm kho
app.put("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, quantity, unit_price, cost, supplier } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE inventory SET name = ?, type = ?, quantity = ?, unit_price = ?, cost = ?, supplier = ? WHERE id = ?",
      [name, type, quantity, unit_price, cost, supplier, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vật phẩm không tồn tại" });
    }
    res.json({ message: "Cập nhật vật phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API xóa vật phẩm kho
app.delete("/api/inventory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM inventory WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vật phẩm không tồn tại" });
    }
    res.json({ message: "Xóa vật phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API báo cáo doanh thu
app.get("/api/reports/revenue", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DATE(created_at) as date, SUM(amount) as total FROM transactions GROUP BY DATE(created_at)"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API sổ quỹ
app.get("/api/cash-flow", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cash_flow ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API cập nhật điểm khách hàng
app.put("/api/customers/:id/points", async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;
    try {
      const [result] = await pool.query(
        "UPDATE customers SET points = ? WHERE id = ?",
        [points, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Khách hàng không tồn tại" });
      }
      res.json({ message: "Cập nhật điểm thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// API báo cáo hoa hồng kỹ thuật viên
app.get("/api/reports/commissions", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.name as technician_name, SUM(tr.amount * s.commission) as total_commission
      FROM transactions tr
      JOIN services s ON tr.service_id = s.id
      JOIN technicians t ON tr.technician_id = t.id
      GROUP BY t.id, t.name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));