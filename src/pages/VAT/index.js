import { Receipt } from 'lucide-react';

const VATUpdate = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed">
      <div className="w-24 h-24 bg-blue-50/50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <Receipt className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">Module Cập Nhật VAT Hàng Loạt</h2>
      <p className="text-slate-500 max-w-md text-center leading-relaxed">
        Giao diện này đang được xây dựng. Khu vực này sẽ cho phép tải lên file Excel hoặc chọn danh sách các trạm để tự động hóa việc đẩy dữ liệu VAT xuống máy khách.
      </p>
      <button className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors border border-slate-300">
        Đang phát triển...
      </button>
    </div>
  );
};

export default VATUpdate;
