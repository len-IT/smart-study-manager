export default function About() {
  return (
    <div className="about-page">
      <div className="about-card pro-about">
        <div className="about-badge">Student Profile</div>
        <h1>Thông tin sinh viên</h1>
        <p className="about-desc">
          Trang thông tin cá nhân của ứng dụng Smart Study Manager
        </p>

        <div className="about-grid">
          <div className="about-item">
            <span>Họ tên</span>
            <strong>Trương Công Lên</strong>
          </div>

          <div className="about-item">
            <span>MSSV</span>
            <strong>2251220010</strong>
          </div>

          <div className="about-item">
            <span>Lớp</span>
            <strong>22CT3</strong>
          </div>

          <div className="about-item">
            <span>Ứng dụng</span>
            <strong>Smart Study Manager Pro</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
