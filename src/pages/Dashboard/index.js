import { AlertCircle, Server, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createTaskAction } from '../../stores/redux/CommandActions';

const Dashboard = () => {
  const [stationId, setStationId] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.command || { loading: false });

  const handleSendCommand = (e) => {
    e.preventDefault();

    if (!stationId || !sqlQuery) {
      return toast.error("Vui lòng điền đầy đủ Mã Trạm và Câu lệnh!");
    }

    dispatch(createTaskAction(stationId, sqlQuery, () => {
      setSqlQuery('');
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Khởi Tạo Lệnh Mới
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Lệnh sẽ được đẩy xuống hàng đợi của Server và truyền qua Socket xuống Local ngay khi trạm kết nối.
          </p>
        </div>

        <form onSubmit={handleSendCommand} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mã Trạm (Station ID)</label>
            <div className="relative">
              <input
                type="text"
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                placeholder="VD: 0312345678_DESKTOP-ABC"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
              <Server className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Cấu trúc: Mã Số Thuế + "_" + Tên Máy Tính (Hostname)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Câu Lệnh SQL (SQL Query)</label>
            <textarea
              rows="6"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="UPDATE Sys_Users SET User_Code = 'admin_vip' WHERE User_id = 1"
              className="w-full p-4 bg-[#1e1e1e] text-[#ce9178] font-mono text-sm rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-inner leading-relaxed resize-y"
              style={{ fontFamily: "'Consolas', 'Courier New', monospace" }}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-blue-600/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang xử lý...</>
              ) : (
                <><TerminalSquare className="w-5 h-5" /> Gửi Lệnh Thực Thi</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
