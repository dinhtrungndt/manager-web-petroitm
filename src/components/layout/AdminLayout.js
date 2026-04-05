import { LayoutDashboard, LogOut, Receipt, TerminalSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Trong VS Code: dùng removeToken() và dispatch xóa Redux state
    localStorage.removeItem('access_token');
    toast.success('Đã đăng xuất!');
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/admin', name: 'Up Lệnh Chạy', icon: <TerminalSquare className="w-5 h-5" /> },
    { path: '/admin/vat', name: 'Cập Nhật VAT', icon: <Receipt className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><LayoutDashboard className="w-6 h-6 text-white" /></div>
          <span className="text-white font-bold text-xl tracking-wide">Petro<span className="text-blue-500">ITM</span></span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            {menuItems.find(m => m.path === location.pathname)?.name || 'Bảng Điều Khiển'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
              AD
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-700">Administrator</p>
              <p className="text-slate-500 text-xs">Đang hoạt động</p>
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          {/* CÁC PAGE CON SẼ HIỂN THỊ VÀO CHỖ NÀY */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};
