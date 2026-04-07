import { AlertTriangle, CheckCircle2, CheckSquare, ChevronRight, Database, History, MessageCircle, Phone, Plus, RefreshCw, Search, Server, Square, TerminalSquare, Trash2, X, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import { createTaskAction } from '../../stores/redux/CommandActions';
import { fetchStationsAction } from '../../stores/redux/StationActions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading: isCommandSending } = useSelector((state) => state.command || { loading: false });
  const { stations, isFetching } = useSelector((state) => state.station || { stations: [], isFetching: true });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStations, setSelectedStations] = useState([]);

  // States Modal Giao Lệnh
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [queries, setQueries] = useState([{ id: Date.now(), text: '' }]);
  const [zaloGroup, setZaloGroup] = useState('');

  // States cho Live Terminal
  const [trackedCommandIds, setTrackedCommandIds] = useState([]);
  const [liveResults, setLiveResults] = useState([]);
  const terminalEndRef = useRef(null);

  // States Modal Lịch Sử
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [taskHistory, setTaskHistory] = useState([]);
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  const fetchStations = useCallback((showLoading = false) => {
    dispatch(fetchStationsAction(showLoading));
  }, [dispatch]);

  useEffect(() => {
    fetchStations(true);
    const interval = setInterval(() => { fetchStations(false); }, 15000);
    return () => clearInterval(interval);
  }, [fetchStations]);

  // Hỗ trợ tìm kiếm theo cả Tên Nhóm Zalo
  const filteredStations = stations.filter(st =>
    st.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.mst.includes(searchQuery) ||
    (st.companyName && st.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (st.zaloGroup && st.zaloGroup.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (st.phone && st.phone.includes(searchQuery))
  );

  const handleSelectAll = () => {
    if (selectedStations.length === filteredStations.length && filteredStations.length > 0) setSelectedStations([]);
    else setSelectedStations(filteredStations.map(st => st.id));
  };

  const handleSelectOne = (id) => {
    if (selectedStations.includes(id)) setSelectedStations(selectedStations.filter(stId => stId !== id));
    else setSelectedStations([...selectedStations, id]);
  };

  const openModal = () => {
    if (selectedStations.length === 0) return toast.error('Vui lòng chọn ít nhất 1 trạm!');
    setIsModalOpen(true);
    setModalStep(0);
    setLiveResults([]);
    setTrackedCommandIds([]);
    setZaloGroup('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep(0);
    setQueries([{ id: Date.now(), text: '' }]);
  };

  const handleExecuteCommand = () => {
    const validQueries = queries.map(q => q.text.trim()).filter(text => text.length > 0);
    if (validQueries.length === 0) return toast.error("Vui lòng nhập ít nhất 1 câu lệnh SQL!");

    dispatch(createTaskAction(selectedStations, validQueries, zaloGroup, (commandIds) => {
      if (commandIds && commandIds.length > 0) {
        setTrackedCommandIds(commandIds);
        setModalStep(2);
        setTimeout(() => fetchStations(false), 500);
      } else {
        closeModal();
        setSelectedStations([]);
      }
    }));
  };

  useEffect(() => {
    if (modalStep === 2 && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveResults, modalStep]);

  useEffect(() => {
    let interval;
    if (modalStep === 2 && trackedCommandIds.length > 0) {
      const allDone = liveResults.length > 0 && liveResults.every(t => t.Status !== 'PENDING');
      if (!allDone) {
        interval = setInterval(async () => {
          try {
            const res = await api.get('/admin/v1/all-tasks');
            const allTasks = res.data.data || [];
            const myTasks = allTasks.filter(t => trackedCommandIds.includes(t.Command_id));
            setLiveResults(myTasks);
          } catch (error) { }
        }, 1500);
      }
    }
    return () => clearInterval(interval);
  }, [modalStep, trackedCommandIds, liveResults]);

  const openHistoryModal = async () => {
    setIsHistoryModalOpen(true);
    setIsFetchingHistory(true);
    try {
      const res = await api.get('/admin/v1/all-tasks');
      setTaskHistory(res.data.data || []);
    } catch (error) {
      toast.error('Không thể lấy lịch sử lệnh!');
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const renderDynamicTable = (jsonString, isDark = false) => {
    if (!jsonString) return null;
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data) || data.length === 0) return <p className="text-slate-500 italic mt-2">Bảng rỗng (0 dòng).</p>;
      const columns = Object.keys(data[0]);

      return (
        <div className={`overflow-x-auto max-h-[400px] border rounded-lg shadow-sm mt-3 ${isDark ? 'border-slate-700 bg-[#0f172a]' : 'border-slate-200 bg-white'}`}>
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
            <thead className={`sticky top-0 z-10 ${isDark ? 'bg-slate-800 shadow-slate-900' : 'bg-slate-100 shadow-sm'}`}>
              <tr>
                {columns.map(col => (
                  <th key={col} className={`p-3 font-semibold border-b border-r last:border-r-0 ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {data.map((row, i) => (
                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                  {columns.map(col => (
                    <td key={col} className={`p-3 border-r last:border-r-0 ${isDark ? 'text-blue-300 border-slate-700' : 'text-slate-700 border-slate-200'}`}>
                      {row[col] === null ? <span className="text-slate-500 italic">NULL</span> : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } catch (e) {
      return <p className="text-red-500 mt-2">Lỗi phân tích dữ liệu JSON.</p>;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <input type="text" placeholder="Tìm MST, Nhóm Zalo, Cty, SĐT..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={openHistoryModal} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm flex items-center gap-2 font-medium text-sm px-4">
              <History className="w-4 h-4" /> Nhật ký & Kết quả
            </button>
            <button onClick={() => fetchStations(true)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm" title="Làm mới danh sách">
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <button onClick={openModal} disabled={selectedStations.length === 0} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm">
              <TerminalSquare className="w-4 h-4" /> Giao Lệnh ({selectedStations.length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 w-16 text-center border-b border-slate-200">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-blue-600">
                    {selectedStations.length === filteredStations.length && filteredStations.length > 0 ? <CheckSquare className="w-5 h-5 text-blue-600 mx-auto" /> : <Square className="w-5 h-5 mx-auto" />}
                  </button>
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Trạng Thái</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Mã Số Thuế</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Tên Doanh Nghiệp</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Nhóm Zalo</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Điện Thoại</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">Hostname</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStations.length === 0 && !isFetching ? (
                <tr><td colSpan="7" className="p-12 text-center"><Server className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500 font-medium">Chưa có trạm nào đăng ký vào hệ thống.</p></td></tr>
              ) : (
                filteredStations.map((station) => (
                  <tr key={station.id} className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedStations.includes(station.id) ? 'bg-blue-50/50' : ''}`} onClick={() => handleSelectOne(station.id)}>
                    <td className="p-4 text-center">{selectedStations.includes(station.id) ? <CheckSquare className="w-5 h-5 text-blue-600 mx-auto" /> : <Square className="w-5 h-5 text-slate-300 mx-auto" />}</td>
                    <td className="p-4">{station.status === 'online' ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Offline</span>}</td>
                    <td className="p-4 font-mono text-sm text-slate-800 font-semibold">{station.mst}</td>
                    <td className="p-4 text-sm font-medium text-slate-700 max-w-[200px] truncate" title={station.companyName}>{station.companyName}</td>

                    {/* CỘT NHÓM ZALO */}
                    <td className="p-4">
                      {station.zaloGroup ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 whitespace-nowrap">
                          <MessageCircle className="w-3.5 h-3.5" /> {station.zaloGroup}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic text-xs">Chưa có</span>
                      )}
                    </td>

                    <td className="p-4 text-sm font-medium text-slate-600">{station.phone && station.phone !== 'Chưa cập nhật' ? <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {station.phone}</span> : <span className="text-slate-400 italic">Trống</span>}</td>
                    <td className="p-4 font-medium text-slate-600 text-xs">{station.hostname}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL GIAO LỆNH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-300 ${modalStep === 2 ? 'max-w-6xl' : 'max-w-3xl'}`}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TerminalSquare className="w-5 h-5 text-blue-600" />
                {modalStep === 2 ? "Live Terminal - Giám sát thực thi" : "Khởi tạo lô lệnh SQL"}
              </h3>
              <button onClick={() => { closeModal(); setSelectedStations([]); }} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`overflow-y-auto flex-1 ${modalStep === 2 ? 'bg-[#0f172a] p-0' : 'bg-slate-50/50 p-6'}`}>
              {modalStep === 0 && (
                <>
                  <div className="mb-5 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium border border-blue-100 flex items-center justify-between">
                    <span>Đang chuẩn bị gửi <strong>{queries.length}</strong> lệnh đến <strong>{selectedStations.length}</strong> trạm đã chọn.</span>
                  </div>

                  {/* THÊM KHUNG NHẬP TÊN NHÓM ZALO VÀO ĐÂY */}
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên nhóm Zalo hỗ trợ (Tùy chọn):</label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={zaloGroup}
                        onChange={(e) => setZaloGroup(e.target.value)}
                        placeholder="Ví dụ: Nhóm Petro..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {queries.map((q, index) => (
                      <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-bold text-slate-700">Lệnh {index + 1}:</label>
                          {queries.length > 1 && (
                            <button onClick={() => setQueries(queries.filter(item => item.id !== q.id))} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Xóa lệnh này"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                        <textarea rows="4" value={q.text} onChange={(e) => setQueries(queries.map(item => item.id === q.id ? { ...item, text: e.target.value } : item))} placeholder="Nhập câu lệnh T-SQL..." className="w-full p-4 bg-[#1e1e1e] text-[#ce9178] font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-600 outline-none shadow-inner resize-y" style={{ fontFamily: "'Consolas', 'Courier New', monospace" }}></textarea>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button onClick={() => setQueries([...queries, { id: Date.now(), text: '' }])} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300 border-dashed transition-all"><Plus className="w-4 h-4" /> Thêm lệnh mới</button>
                  </div>
                </>
              )}

              {modalStep === 1 && (
                <div className="h-full flex flex-col justify-center items-center text-center p-10">
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 border-8 border-red-50">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-4">CẢNH BÁO MỨC ĐỘ CAO!</h2>
                  <p className="text-slate-600 text-lg leading-relaxed max-w-lg mb-6">
                    Lô gồm <strong>{queries.filter(q => q.text.trim()).length}</strong> lệnh SQL này sẽ được thực thi đồng loạt trên <strong>{selectedStations.length} Database</strong> khách hàng.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm font-medium text-left max-w-xl">
                    <p className="flex items-start gap-2"><ChevronRight className="w-5 h-5 shrink-0" /> Các lệnh UPDATE/DELETE nếu quên điều kiện WHERE sẽ phá hủy toàn bộ dữ liệu.</p>
                    <p className="flex items-start gap-2 mt-2"><ChevronRight className="w-5 h-5 shrink-0" /> Kết quả sẽ được ghi log trực tiếp ra màn hình Live Terminal ở bước tiếp theo.</p>
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div className="p-6 font-mono text-sm space-y-4">
                  {liveResults.length === 0 && (
                    <div className="flex items-center gap-3 text-slate-400 p-4 border border-slate-800 border-dashed rounded-lg">
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      Đang chờ máy khách phản hồi...
                    </div>
                  )}

                  {liveResults.map((task, idx) => (
                    <div key={task.Command_id} className="border border-slate-700 bg-[#1e293b] rounded-lg overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4">
                      <div className="bg-[#0f172a] px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                        <span className="text-blue-400 font-bold flex items-center gap-2">
                          <Server className="w-4 h-4" /> {task.Station_id.split('_')[1] || task.Station_id}
                        </span>
                        {task.Status === 'PENDING' ? <span className="text-yellow-400 text-xs flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div> Đang chạy...</span>
                          : task.Status === 'SUCCESS' ? <span className="text-green-400 text-xs font-bold">HOÀN THÀNH</span>
                            : <span className="text-red-400 text-xs font-bold">THẤT BẠI</span>}
                      </div>

                      <div className="p-4">
                        <p className="text-slate-400 mb-3 whitespace-pre-wrap">{task.Sql_query}</p>

                        {task.Status !== 'PENDING' && (
                          <div className="mt-3 pt-3 border-t border-slate-700/50">
                            {task.Status === 'SUCCESS' ? (
                              <p className="text-green-400 flex items-start gap-2 font-bold">
                                <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> {task.Message}
                              </p>
                            ) : (
                              <p className="text-red-400 flex items-start gap-2 font-bold">
                                <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> LỖI SQL: {task.Message}
                              </p>
                            )}
                            {task.Result_Data && task.Result_Data !== 'null' && (
                              <div className="mt-4">
                                {renderDynamicTable(task.Result_Data, true)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              {modalStep !== 2 && <button onClick={closeModal} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Hủy bỏ</button>}
              {modalStep === 0 && <button onClick={() => setModalStep(1)} disabled={queries.every(q => !q.text.trim())} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2">Tiếp tục <ChevronRight className="w-4 h-4" /></button>}
              {modalStep === 1 && (
                <button onClick={handleExecuteCommand} disabled={isCommandSending} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-red-500/20">
                  {isCommandSending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang đẩy lệnh...</> : <>XÁC NHẬN PHÁT LỆNH</>}
                </button>
              )}
              {modalStep === 2 && <button onClick={() => { closeModal(); setSelectedStations([]); }} className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors shadow-md">ĐÓNG TERMINAL</button>}
            </div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" /> Nhật ký Giao Lệnh
              </h3>
              <div className="flex gap-2">
                <button onClick={openHistoryModal} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg" title="Làm mới lịch sử"><RefreshCw className={`w-5 h-5 ${isFetchingHistory ? 'animate-spin' : ''}`} /></button>
                <button onClick={() => { setIsHistoryModalOpen(false); setSelectedTaskData(null); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50/50">
              <div className={`w-full ${selectedTaskData ? 'md:w-1/3 border-r border-slate-200' : 'md:w-full'} overflow-y-auto p-4 space-y-3 transition-all duration-300`}>
                {isFetchingHistory && taskHistory.length === 0 ? (
                  <p className="text-center text-slate-500 mt-10">Đang tải lịch sử...</p>
                ) : taskHistory.length === 0 ? (
                  <p className="text-center text-slate-500 mt-10">Chưa có lịch sử giao lệnh nào.</p>
                ) : (
                  taskHistory.map((task) => (
                    <div
                      key={task.Command_id}
                      className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${selectedTaskData?.Command_id === task.Command_id ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}
                      onClick={() => setSelectedTaskData(task)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{task.Station_id.split('_')[1] || task.Station_id}</span>
                        {task.Status === 'SUCCESS' ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded"><CheckCircle2 className="w-3.5 h-3.5" /> XONG</span>
                          : task.Status === 'FAILED' ? <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded"><XCircle className="w-3.5 h-3.5" /> LỖI</span>
                            : <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">CHỜ CHẠY</span>}
                      </div>

                      <p className="text-sm font-mono text-slate-700 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 mb-2" title={task.Sql_query}>{task.Sql_query}</p>

                      {task.Status !== 'PENDING' && (
                        <div className={`text-xs p-1.5 rounded mb-2 border line-clamp-2 ${task.Status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                          <span className="font-bold">Log:</span> {task.Message || 'Chưa có thông báo log'}
                        </div>
                      )}

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-400">{task.Executed_at || task.Created_at}</span>
                          {task.Zalo_Group && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit">
                              <MessageCircle className="w-3 h-3" /> {task.Zalo_Group}
                            </span>
                          )}
                        </div>
                        {task.Result_Data && task.Result_Data !== 'null' && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full"><Database className="w-3 h-3" /> Xem Bảng</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedTaskData && (
                <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-white flex flex-col animate-in slide-in-from-right-4 duration-300">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">
                    Kết quả thực thi
                    <button onClick={() => setSelectedTaskData(null)} className="text-slate-400 hover:text-slate-700 md:hidden"><X className="w-5 h-5" /></button>
                  </h4>

                  {selectedTaskData.Zalo_Group && (
                    <div className="mb-3 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Lệnh thuộc nhóm Zalo: <strong>{selectedTaskData.Zalo_Group}</strong>
                    </div>
                  )}

                  <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border ${selectedTaskData.Status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    <span className="font-bold">Thông báo từ trạm: </span>
                    {selectedTaskData.Message || (selectedTaskData.Status === 'SUCCESS' ? 'Lệnh đã được thực thi thành công.' : 'Lệnh bị lỗi hoặc chưa chạy.')}
                  </div>

                  {selectedTaskData.Result_Data && selectedTaskData.Result_Data !== 'null' ? (
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Database className="w-4 h-4 text-indigo-500" /> Dữ liệu trả về (Tối đa 100 dòng đầu):</p>
                      {renderDynamicTable(selectedTaskData.Result_Data, false)}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-10 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                      <TerminalSquare className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="text-center font-medium">Lệnh thao tác Dữ liệu (UPDATE/INSERT/DELETE) không sinh ra Bảng kết quả.</p>
                      <p className="text-sm text-slate-400 mt-2 text-center max-w-sm">
                        Kết quả thực thi (số dòng bị ảnh hưởng) đã được ghi nhận ở phần Thông báo Log phía trên.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
