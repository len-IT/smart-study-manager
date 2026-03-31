import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import About from "./pages/About";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = ["Tất cả", "Chưa làm", "Đang làm", "Hoàn thành"];

function Home() {
  const [studyTasks, setStudyTasks] = useState([]);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterSubject, setFilterSubject] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);

  const fetchStudyTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/study-tasks`);
      setStudyTasks(res.data);
    } catch (error) {
      setMessage("Không thể tải danh sách việc học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyTasks();
  }, []);

  const addStudyTask = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !title.trim() || !deadline) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/study-tasks`, {
        subject,
        title,
        deadline,
      });

      setSubject("");
      setTitle("");
      setDeadline("");
      setShowForm(false);
      setMessage("Thêm việc học thành công");
      fetchStudyTasks();
    } catch (error) {
      setMessage("Thêm việc học thất bại");
    }
  };

  const changeStatus = async (task) => {
    const nextStatus =
      task.status === "Chưa làm"
        ? "Đang làm"
        : task.status === "Đang làm"
        ? "Hoàn thành"
        : "Chưa làm";

    try {
      await axios.put(`${API_URL}/api/study-tasks/${task._id}`, {
        status: nextStatus,
      });
      setMessage("Cập nhật trạng thái thành công");
      fetchStudyTasks();
    } catch (error) {
      setMessage("Cập nhật trạng thái thất bại");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/study-tasks/${taskId}`);
      setMessage("Xóa việc học thành công");
      fetchStudyTasks();
    } catch (error) {
      setMessage("Backend hiện chưa có API DELETE. Hãy thêm endpoint DELETE để dùng chức năng xóa.");
    }
  };

  const subjects = useMemo(() => {
    const values = [...new Set(studyTasks.map((task) => task.subject))];
    return ["Tất cả", ...values];
  }, [studyTasks]);

  const stats = useMemo(() => {
    const total = studyTasks.length;
    const todo = studyTasks.filter((task) => task.status === "Chưa làm").length;
    const doing = studyTasks.filter((task) => task.status === "Đang làm").length;
    const done = studyTasks.filter((task) => task.status === "Hoàn thành").length;
    return { total, todo, doing, done };
  }, [studyTasks]);

  const filteredTasks = useMemo(() => {
    return studyTasks.filter((task) => {
      const matchStatus = filterStatus === "Tất cả" || task.status === filterStatus;
      const matchSubject = filterSubject === "Tất cả" || task.subject === filterSubject;
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        task.title.toLowerCase().includes(keyword) ||
        task.subject.toLowerCase().includes(keyword);

      return matchStatus && matchSubject && matchSearch;
    });
  }, [studyTasks, filterStatus, filterSubject, search]);

  const getStatusClass = (status) => {
    if (status === "Hoàn thành") return "badge badge-success";
    if (status === "Đang làm") return "badge badge-warning";
    return "badge badge-muted";
  };

  const getDeadlineText = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate.setHours(0, 0, 0, 0) - new Date(today.setHours(0, 0, 0, 0));
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: "Đã quá hạn", className: "deadline deadline-late" };
    if (days === 0) return { text: "Đến hạn hôm nay", className: "deadline deadline-today" };
    if (days <= 3) return { text: `Còn ${days} ngày`, className: "deadline deadline-soon" };
    return { text: `Còn ${days} ngày`, className: "deadline deadline-normal" };
  };

  const completionRate = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  return (
    <div className="home-shell">
      <section className="hero-pro">
        <div className="hero-left">
          <div className="hero-pill">Smart Study Manager Pro</div>
          <h1>Quản lý học tập thông minh</h1>
<p>
  Theo dõi môn học, deadline và tiến độ trong một nơi.
</p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setShowForm(true)}>
              Thêm việc học
            </button>
            <a href="#study-board" className="ghost-btn">
              Xem bảng việc học
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="progress-card">
            <div className="progress-top">
              <span>Tiến độ học tập</span>
              <strong>{completionRate}%</strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionRate}%` }} />
            </div>
            <p>{stats.done}/{stats.total} việc học đã hoàn thành</p>
          </div>
        </div>
      </section>

      <section className="stats-grid-pro">
        <div className="stat-card-pro">
          <span className="stat-icon">📚</span>
          <div>
            <div className="stat-label">Tổng việc học</div>
            <div className="stat-number">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card-pro">
          <span className="stat-icon">📝</span>
          <div>
            <div className="stat-label">Chưa làm</div>
            <div className="stat-number">{stats.todo}</div>
          </div>
        </div>

        <div className="stat-card-pro">
          <span className="stat-icon">⏳</span>
          <div>
            <div className="stat-label">Đang làm</div>
            <div className="stat-number">{stats.doing}</div>
          </div>
        </div>

        <div className="stat-card-pro">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-label">Hoàn thành</div>
            <div className="stat-number">{stats.done}</div>
          </div>
        </div>
      </section>

      <section className="toolbar-pro" id="study-board">
        <div className="toolbar-title">
          <h2>Bảng việc học</h2>
          <p>Tìm kiếm, lọc và theo dõi nhiệm vụ học tập theo thời gian thực.</p>
        </div>

        <div className="toolbar-controls">
          <input
            className="search-input"
            type="text"
            placeholder="Tìm theo môn học hoặc tên công việc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            {subjects.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </section>

      {message && <div className="alert-box pro-alert">{message}</div>}

      {loading ? (
        <div className="empty-box">Đang tải dữ liệu...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>Chưa có việc học phù hợp</h3>
          <p>Hãy thêm nhiệm vụ mới hoặc thay đổi bộ lọc để xem dữ liệu.</p>
          <button className="primary-btn" onClick={() => setShowForm(true)}>
            Tạo việc học đầu tiên
          </button>
        </div>
      ) : (
        <section className="task-grid-pro">
          {filteredTasks.map((task) => {
            const deadlineInfo = getDeadlineText(task.deadline);

            return (
              <article key={task._id} className="task-card-pro">
                <div className="task-card-header">
                  <span className={getStatusClass(task.status)}>{task.status}</span>
                  <span className={deadlineInfo.className}>{deadlineInfo.text}</span>
                </div>

                <h3>{task.title}</h3>

                <div className="task-subject-chip">{task.subject}</div>

                <div className="task-info">
                  <div className="task-info-item">
                    <span>Deadline</span>
                    <strong>{task.deadline}</strong>
                  </div>
                  <div className="task-info-item">
                    <span>Môn học</span>
                    <strong>{task.subject}</strong>
                  </div>
                </div>

                <div className="task-actions">
                  <button className="secondary-btn" onClick={() => changeStatus(task)}>
                    Đổi trạng thái
                  </button>
                  <button className="danger-btn" onClick={() => deleteTask(task._id)}>
                    Xóa
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <h2>Thêm việc học mới</h2>
                <p>Nhập môn học, nhiệm vụ và thời hạn hoàn thành.</p>
              </div>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={addStudyTask} className="study-form-pro">
              <div className="field">
                <label>Tên môn học</label>
                <input
                  type="text"
                  placeholder="Ví dụ: DevOps"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Công việc học tập</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàn thành bài thực hành Docker"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <button type="submit" className="primary-btn full-btn">
                Lưu việc học
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">SS</div>
          <div>
            <div className="brand-name">Smart Study Manager Pro</div>
            <div className="brand-sub">Beautiful Study Dashboard</div>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/about">/about</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
