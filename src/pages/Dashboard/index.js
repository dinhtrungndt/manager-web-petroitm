import { AlertTriangle, CheckSquare, Plus, RefreshCw, Search, Server, Square, TerminalSquare, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createTaskAction } from '../../stores/redux/CommandActions';
import { fetchStationsAction } from '../../stores/redux/StationActions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading: isCommandSending } = useSelector((state) => state.command || { loading: false });
  const { stations, isFetching } = useSelector((state) => state.station || { stations: [], isFetching: true });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStations, setSelectedStations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const [queries, setQueries] = useState([{ id: Date.now(), text: '' }]);

  const fetchStations = useCallback((showLoading = false) => {
    dispatch(fetchStationsAction(showLoading));
  }, [dispatch]);

  useEffect(() => {
    fetchStations(true);
    const interval = setInterval(() => { fetchStations(false); }, 15000);
    return () => clearInterval(interval);
  }, [fetchStations]);

  const filteredStations = stations.filter(st =>
    st.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.mst.includes(searchQuery)
  );

  const handleSelectAll = () => {
    if (selectedStations.length === filteredStations.length && filteredStations.length > 0) {
      setSelectedStations([]);
    } else {
      setSelectedStations(filteredStations.map(st => st.id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedStations.includes(id)) {
      setSelectedStations(selectedStations.filter(stId => stId !== id));
    } else {
      setSelectedStations([...selectedStations, id]);
    }
  };

  const openModal = () => {
    if (selectedStations.length === 0) return toast.error('Vui lòng chọn ít nhất 1 trạm!');
    setIsModalOpen(true);
    setIsConfirming(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsConfirming(false);
    setQueries([{ id: Date.now(), text: '' }]);
  };

  const addQueryBox = () => {
    setQueries([...queries, { id: Date.now(), text: '' }]);
  };

  const removeQueryBox = (idToRemove) => {
    if (queries.length === 1) return;
    setQueries(queries.filter(q => q.id !== idToRemove));
  };

  const updateQueryText = (id, newText) => {
    setQueries(queries.map(q => q.id === id ? { ...q, text: newText } : q));
  };

  const handleExecuteCommand = () => {
    const validQueries = queries.map(q => q.text.trim()).filter(text => text.length > 0);

    if (validQueries.length === 0) {
      return toast.error("Vui lòng nhập ít nhất 1 câu lệnh SQL!");
    }

    dispatch(createTaskAction(selectedStations, validQueries, () => {
      closeModal();
      setSelectedStations([]);
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Server className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-slate-500">Tổng số trạm cài Agent</p><p className="text-xl font-bold text-slate-800">{stations.length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <div className="w-6 h-6 flex items-center justify-center"><div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div></div>
          </div>
          <div><p className="text-sm font-medium text-slate-500">Đang Online</p><p className="text-xl font-bold text-slate-800">{stations.filter(s => s.status === 'online').length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><CheckSquare className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-slate-500">Đang được chọn</p><p className="text-xl font-bold text-slate-800">{selectedStations.length}</p></div>
        </div>
      </div>

      {/* BẢNG QUẢN LÝ TRẠM */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
        {/* Toolbar Bảng */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm MST, Hostname..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => fetchStations(true)}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
              title="Làm mới danh sách"
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <button
              onClick={openModal}
              disabled={selectedStations.length === 0}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <TerminalSquare className="w-4 h-4" />
              Giao Lệnh ({selectedStations.length})
            </button>
          </div>
        </div>

        {/* Khung chứa Bảng */}
        <div className="flex-1 overflow-auto relative">
          {isFetching && stations.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-slate-500">Đang tải danh sách trạm...</p>
            </div>
          ) : null}

          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 w-16 text-center border-b border-slate-200">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-blue-600">
                    {selectedStations.length === filteredStations.length && filteredStations.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-blue-600 mx-auto" />
                    ) : (
                      <Square className="w-5 h-5 mx-auto" />
                    )}
                  </button>
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Trạng Thái</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Mã Số Thuế</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Tên Máy (Hostname)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Truy cập cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStations.length === 0 && !isFetching ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Server className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Chưa có trạm nào đăng ký vào hệ thống.</p>
                  </td>
                </tr>
              ) : (
                filteredStations.map((station) => (
                  <tr
                    key={station.id}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedStations.includes(station.id) ? 'bg-blue-50/50' : ''}`}
                    onClick={() => handleSelectOne(station.id)}
                  >
                    <td className="p-4 text-center">
                      {selectedStations.includes(station.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 mx-auto" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="p-4">
                      {station.status === 'online' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Offline
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-800 font-semibold">{station.mst}</td>
                    <td className="p-4 font-medium text-slate-600">{station.hostname}</td>
                    <td className="p-4 text-sm text-slate-400">{station.lastActive}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL HỘP THOẠI XÁC NHẬN (CÓ CHỨC NĂNG THÊM NHIỀU QUERY) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TerminalSquare className="w-5 h-5 text-blue-600" />
                Khởi tạo lô lệnh SQL
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body (Scrollable) */}
            <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
              <div className="mb-5 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium border border-blue-100 flex items-center justify-between">
                <span>Đang chuẩn bị gửi <strong>{queries.length}</strong> lệnh đến <strong>{selectedStations.length}</strong> trạm đã chọn.</span>
              </div>

              <div className="space-y-4">
                {queries.map((q, index) => (
                  <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-slate-700">Lệnh {index + 1}:</label>

                      {/* Chỉ hiện nút Xóa nếu có nhiều hơn 1 ô */}
                      {queries.length > 1 && (
                        <button
                          onClick={() => removeQueryBox(q.id)}
                          disabled={isConfirming || isCommandSending}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Xóa lệnh này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <textarea
                      rows="4"
                      value={q.text}
                      onChange={(e) => updateQueryText(q.id, e.target.value)}
                      disabled={isConfirming || isCommandSending}
                      placeholder="Nhập câu lệnh T-SQL..."
                      className="w-full p-4 bg-[#1e1e1e] text-[#ce9178] font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none shadow-inner disabled:opacity-80 resize-y"
                      style={{ fontFamily: "'Consolas', 'Courier New', monospace" }}
                    ></textarea>
                  </div>
                ))}
              </div>

              {/* Nút thêm ô query mới */}
              {!isConfirming && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={addQueryBox}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300 border-dashed transition-all"
                  >
                    <Plus className="w-4 h-4" /> Thêm lệnh mới
                  </button>
                </div>
              )}

              {/* Cảnh báo khi nhấn Tiếp Tục */}
              {isConfirming && (
                <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-bottom-2">
                  <AlertTriangle className="w-7 h-7 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-bold text-red-800 mb-1">CẢNH BÁO MỨC ĐỘ CAO!</p>
                    <p className="text-sm text-red-700 leading-relaxed">
                      Lô gồm <strong>{queries.filter(q => q.text.trim()).length}</strong> lệnh SQL này sẽ được thực thi trên <strong>{selectedStations.length} Database</strong> khách hàng.<br />
                      Vui lòng kiểm tra lại cấu trúc (Cẩn thận các lệnh UPDATE/DELETE quên WHERE). Bạn có chắc chắn muốn phát lệnh?
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button
                onClick={closeModal}
                disabled={isCommandSending}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>

              {!isConfirming ? (
                <button
                  onClick={() => setIsConfirming(true)}
                  disabled={queries.every(q => !q.text.trim())} // Disable nếu TẤT CẢ các ô đều rỗng
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  Tiếp tục <TerminalSquare className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleExecuteCommand}
                  disabled={isCommandSending}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-red-500/20"
                >
                  {isCommandSending ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang gửi lệnh...</>
                  ) : (
                    <>PHÁT LỆNH NGAY</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
