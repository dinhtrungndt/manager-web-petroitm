const VATUpdate = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed">
      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
        <Receipt className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Tính năng đang phát triển</h2>
      <p className="text-slate-500 max-w-md text-center">
        Form cập nhật VAT hàng loạt sẽ được hiển thị ở đây. Hiện tại hệ thống đang tập trung xử lý luồng chạy SQL Real-time.
      </p>
    </div>
  );
};
