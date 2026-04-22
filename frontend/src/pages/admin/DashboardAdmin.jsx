import { Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import "./adminLayout.css";

const DashboardAdmin = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-top-card">
          <span className="admin-top-label">Administration</span>
          <h2 className="admin-main-title">Dashboard</h2>
        
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;