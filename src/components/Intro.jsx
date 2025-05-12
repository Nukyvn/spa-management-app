import { useNavigate } from 'react-router-dom';

function IntroPage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <img src="/logo.png" alt="Logo Spa" className="img-fluid mb-4" style={{ maxWidth: "200px" }} />
      <h1 className="display-3 mb-3 fw-bold">Spa Thư Giãn</h1>
      <p className="lead mb-2 fs-4">Địa chỉ: 123 Đường Láng, Hà Nội</p>
      <p className="lead mb-4 fs-4">Hotline: 0123 456 789</p>
      <p className="mb-5 fs-5 text-muted">
        Chào mừng bạn đến với hệ thống quản lý Spa Thư Giãn.
      </p>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        <button
          onClick={() => navigate("/billing")}
          className="btn btn-primary btn-lg px-5 py-3"
        >
          Tính Tiền
        </button>
        <button
          onClick={() => navigate("/management")}
          className="btn btn-danger btn-lg px-5 py-3"
        >
          Dịch Vụ
        </button>
        <button
          onClick={() => navigate("/appointment")}
          className="btn btn-success btn-lg px-5 py-3"
        >
          Lịch Hẹn
        </button>
      </div>
    </div>
  );
}

export default IntroPage;