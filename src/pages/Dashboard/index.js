import { Server, TerminalSquare } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const Dashboard = () => {
  const [stationId, setStationId] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendCommand = async (e) => {
    e.preventDefault();
    if (!stationId || !sqlQuery) return toast.error("Vui lòng nhập đủ thông tin!");

    setIsSending(true);
    try {
      const res = await api.post('/admin/v1/create-task', { station_id: stationId, sql_query: sqlQuery });
      toast.success(res.data.message || 'Bắn lệnh thành công!');
      setSqlQuery(''); // Clear form sau khi bắn
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi gửi lệnh!');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-blue-600" /> Giao Lệnh Trực Tiếp (Real-time)
          </h2>
          <p className="text-slate-500 text-sm mt-1">Lệnh sẽ được đẩy thẳng xuống máy khách qua kết nối Socket bảo mật.</p>
        </div>

        <form onSubmit={handleSendCommand} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mã Trạm (Station ID)</label>
            <input
              type="text"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              placeholder="VD: 0312345678_DESKTOP-ABC"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">* Nhập đúng mã Số thuế _ Hostname của khách hàng.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Câu Lệnh SQL (SQL Query)</label>
            <div className="relative">
              <textarea
                rows="5"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="UPDATE Sys_Users SET User_Code = 'vip' WHERE User_id = 1"
                className="w-full px-4 py-3 bg-slate-800 text-green-400 font-mono text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-inner"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70"
            >
              {isSending ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang bắn lệnh...</>
              ) : (
                <><Server className="w-5 h-5" /> Bắn Lệnh Ngay</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
