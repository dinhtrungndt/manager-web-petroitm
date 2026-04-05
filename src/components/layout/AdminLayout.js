import { LogOut, Menu, Receipt, Server, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logoutAction } from '../../stores/redux/AuthActions';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logoutAction(navigate));
  };

  const menuItems = [
    { path: '/admin', name: 'Giao Lệnh SQL', icon: <TerminalSquare className="w-5 h-5" /> },
    { path: '/admin/vat', name: 'Cập Nhật VAT', icon: <Receipt className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">

      <aside
        className={`bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        <div className={`p-4 border-b border-slate-800 flex items-center h-[73px] ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>

          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50 shrink-0">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div className="shrink-0">
              <span className="text-white font-bold text-xl tracking-wide block leading-none mb-1">
                Petro<span className="text-blue-500">ITM</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="group relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg shrink-0 transition-colors"
          >
            <Menu className="w-6 h-6" />
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg border border-slate-700/50">
                Mở rộng menu
              </div>
            )}
          </button>
        </div>

        <nav className={`flex-1 py-6 space-y-2 px-3 ${isSidebarOpen ? 'overflow-y-auto overflow-x-hidden' : 'overflow-visible'}`}>
          {isSidebarOpen && (
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Quản lý trạm
            </p>
          )}

          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative w-full flex items-center rounded-xl transition-all duration-200 ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'justify-center py-3'
                } ${location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              <div className="shrink-0">{item.icon}</div>

              {isSidebarOpen && (
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}

              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg border border-slate-700/50">
                  {item.name}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center transition-all ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-2 justify-center'}`}>
            <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>

            {isSidebarOpen && (
              <div className="text-left overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">Administrator</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Online
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`group relative w-full flex items-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'py-3 justify-center'
              }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />

            {isSidebarOpen && (
              <span className="font-medium text-sm whitespace-nowrap">Đăng xuất</span>
            )}

            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                Đăng xuất
              </div>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex items-center justify-between z-0 h-[73px]">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {menuItems.find(m => m.path === location.pathname)?.icon}
            {menuItems.find(m => m.path === location.pathname)?.name || 'Bảng Điều Khiển'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium border border-slate-200">
              Hệ thống hoạt động ổn định
            </span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
