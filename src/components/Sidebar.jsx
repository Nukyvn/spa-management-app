function Sidebar({ navigate, toggleSidebar, isCollapsed }) {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            height: '50px',
          }}
        >
          <h3
            style={{
              color: '#fff',
              fontSize: '1.2rem',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isCollapsed ? "Spa" : "Spa Thư Giãn"}
          </h3>
          <button
            style={{
              backgroundColor: '#fff',
              color: '#6d2077',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e1bee7')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
            onClick={toggleSidebar}
          >
            <i className={`bi ${isCollapsed ? 'bi-arrow-right' : 'bi-arrow-left'}`}></i>
          </button>
        </div>
        <ul
          style={{
            padding: 0,
            margin: 0,
            listStyle: 'none',
          }}
        >
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-house"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Trang Chủ</span>}
            </a>
          </li>
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/billing");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-calculator"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Tính Tiền</span>}
            </a>
          </li>
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/management");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-gear"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Dịch Vụ</span>}
            </a>
          </li>
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/customers");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-people"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Khách Hàng</span>}
            </a>
          </li>
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/technicians");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-person-gear"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Kỹ Thuật Viên</span>}
            </a>
          </li>
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/appointment");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-calendar"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Lịch Hẹn</span>}
            </a>
          </li>
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/inventory");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-box"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Nhập Hàng</span>}
            </a>
          </li>
          <li
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/report");
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b1652')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i
                className="bi bi-bar-chart"
                style={{
                  marginRight: '8px',
                  minWidth: '20px',
                  fontSize: '1rem',
                }}
              ></i>
              {!isCollapsed && <span>Báo Cáo</span>}
            </a>
          </li>
        </ul>
      </div>
    );
  }
  
  export default Sidebar;