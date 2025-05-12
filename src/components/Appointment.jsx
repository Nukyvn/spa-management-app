import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { getAppointments, getTechnicians, addAppointment, updateAppointment, deleteAppointment } from "../utils/api";

function AppointmentPage({ navigate }) {
  const [events, setEvents] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    customer_id: "",
    service_id: "",
    technician_id: "",
    start_time: "",
  });
  const [editAppointment, setEditAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAppointments().then((res) => {
      const events = res.data.map((appt) => ({
        id: appt.id,
        title: `Dịch vụ - Khách ${appt.customer_id}`,
        start: appt.start_time,
        completed: appt.completed,
      }));
      setEvents(events);
    }).catch((err) => console.error(err));
    getTechnicians().then((res) => setTechnicians(res.data)).catch((err) => console.error(err));
  }, []);

  const handleAddAppointment = async () => {
    if (!newAppointment.customer_id || !newAppointment.service_id || !newAppointment.technician_id || !newAppointment.start_time) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const response = await addAppointment(newAppointment);
      setEvents([...events, {
        id: response.data.id,
        title: `Dịch vụ - Khách ${newAppointment.customer_id}`,
        start: newAppointment.start_time,
        completed: false,
      }]);
      setNewAppointment({ customer_id: "", service_id: "", technician_id: "", start_time: "" });
      setShowForm(false);
      alert("Thêm lịch hẹn thành công!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleEditAppointment = async () => {
    if (!editAppointment.customer_id || !editAppointment.service_id || !editAppointment.technician_id || !editAppointment.start_time) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      await updateAppointment(editAppointment.id, editAppointment);
      setEvents(events.map((e) => (e.id === editAppointment.id ? {
        ...e,
        title: `Dịch vụ - Khách ${editAppointment.customer_id}`,
        start: editAppointment.start_time,
        completed: editAppointment.completed,
      } : e)));
      setEditAppointment(null);
      setShowForm(false);
      alert("Cập nhật lịch hẹn thành công!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch hẹn này?")) return;
    try {
      await deleteAppointment(id);
      setEvents(events.filter((e) => e.id !== id));
      alert("Xóa lịch hẹn thành công!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      const appointment = events.find((e) => e.id === id);
      const updatedAppointment = { ...appointment, completed: true };
      await updateAppointment(id, updatedAppointment);
      setEvents(events.map((e) => (e.id === id ? { ...e, completed: true } : e)));
      alert("Hoàn thành lịch hẹn!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 display-5 fw-bold">Lịch Hẹn</h2>
      <div className="card p-4 mb-4">
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-plus"></i> {showForm ? "Ẩn Form" : "Thêm Lịch Hẹn"}
        </button>
        {showForm && (
          <div className="mb-3">
            <label className="form-label">ID Khách hàng</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nhập ID khách hàng"
              value={editAppointment ? editAppointment.customer_id : newAppointment.customer_id}
              onChange={(e) => {
                const value = e.target.value;
                editAppointment
                  ? setEditAppointment({ ...editAppointment, customer_id: value })
                  : setNewAppointment({ ...newAppointment, customer_id: value });
              }}
            />
            <label className="form-label">ID Dịch vụ</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nhập ID dịch vụ"
              value={editAppointment ? editAppointment.service_id : newAppointment.service_id}
              onChange={(e) => {
                const value = e.target.value;
                editAppointment
                  ? setEditAppointment({ ...editAppointment, service_id: value })
                  : setNewAppointment({ ...newAppointment, service_id: value });
              }}
            />
            <label className="form-label">Kỹ thuật viên</label>
            <select
              className="form-select mb-3"
              value={editAppointment ? editAppointment.technician_id : newAppointment.technician_id}
              onChange={(e) => {
                const value = e.target.value;
                editAppointment
                  ? setEditAppointment({ ...editAppointment, technician_id: value })
                  : setNewAppointment({ ...newAppointment, technician_id: value });
              }}
            >
              <option value="">Chọn kỹ thuật viên</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
            <label className="form-label">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              className="form-control mb-3"
              value={editAppointment ? editAppointment.start_time : newAppointment.start_time}
              onChange={(e) => {
                const value = e.target.value;
                editAppointment
                  ? setEditAppointment({ ...editAppointment, start_time: value })
                  : setNewAppointment({ ...newAppointment, start_time: value });
              }}
            />
            <button
              onClick={editAppointment ? handleEditAppointment : handleAddAppointment}
              className="btn btn-success px-4 py-2"
            >
              <i className="bi bi-plus"></i> {editAppointment ? "Cập Nhật Lịch Hẹn" : "Thêm Lịch Hẹn"}
            </button>
            {editAppointment && (
              <button
                onClick={() => setEditAppointment(null)}
                className="btn btn-secondary ms-2 px-4 py-2"
              >
                <i className="bi bi-x"></i> Hủy
              </button>
            )}
          </div>
        )}
      </div>
      <div className="card p-4">
        <h3 className="mb-3 fs-4">Lịch Hẹn</h3>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          eventClick={(info) => {
            const event = events.find((e) => e.id === parseInt(info.event.id));
            setEditAppointment({
              id: event.id,
              customer_id: event.title.split('Khách ')[1],
              service_id: "",
              technician_id: "",
              start_time: event.start,
              completed: event.completed,
            });
            setShowForm(true);
          }}
        />
        <div className="mt-3">
          {events.map((event) => (
            <div key={event.id} className="d-flex justify-content-between align-items-center mb-2">
              <span>{event.title} - {new Date(event.start).toLocaleString('vi-VN')}</span>
              <div>
                {!event.completed && (
                  <button
                    onClick={() => handleCompleteAppointment(event.id)}
                    className="btn btn-success btn-sm me-2"
                  >
                    <i className="bi bi-check-circle"></i> Hoàn thành
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAppointment(event.id)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash"></i> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppointmentPage;