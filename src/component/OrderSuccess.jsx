import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Import Thai sarabunFont สำหรับ jsPDF
import sarabunFont from "../assets/fonts/sarabun-regular";

// ฟังก์ชันเพิ่ม Font Thai sarabunFont สำหรับ jsPDF
function addThaiFont(doc) {
  try {
    doc.addFileToVFS("Sarabun-Regular.ttf", sarabunFont);
    doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
  } catch (error) {
    console.error("Error adding Thai font:", error);
  }
}

// ฟังก์ชันจัดรูปแบบเงิน
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount);
};

// ฟังก์ชันดึงข้อมูล user จาก localStorage อย่างปลอดภัย
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : { username: "Guest" };
  } catch (error) {
    console.error("Error parsing user data:", error);
    return { username: "Guest" };
  }
};

// ฟังก์ชันจัดรูปแบบวันที่
const formatDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

function OrderSuccess({ order, onBack }) {
  if (!order || !order.items || order.items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl px-8 py-8 shadow-xl min-w-[340px]">
          <div className="text-red-600 text-xl font-bold text-center mb-4">
            Order not found
          </div>
          <button
            className="block w-full bg-gray-100 text-gray-600 py-2 rounded-lg font-bold hover:bg-gray-200"
            onClick={onBack}
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // ดึง user จาก order หรือ localStorage
  const user = order.user || getUserFromStorage();

  const handleDownloadPDF = async () => {
    try {
      // ตรวจสอบข้อมูลก่อนสร้าง PDF
      if (!order?.items?.length) {
        alert("No order data found to generate PDF");
        return;
      }

      const doc = new jsPDF();
      addThaiFont(doc);
      doc.setFont("Sarabun", "normal");

      // Header
      doc.setFontSize(22);
      doc.text("Order Receipt", 20, 20);

      // วันที่และเวลา
      doc.setFontSize(12);
      doc.text(`วันที่: ${formatDate()}`, 20, 35);
      doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, 20, 45);

      // ข้อมูลคำสั่งซื้อ
      doc.setFontSize(14);
      doc.text(`Order ID: ${order.orderId || 'N/A'}`, 20, 60);
      doc.text(`Customer: ${user.username || "Guest"}`, 20, 70);

      // เส้นคั่น
      doc.setLineWidth(0.5);
      doc.line(20, 80, 190, 80);

      // Table rows
      const rows = order.items.map((item, idx) => [
        idx + 1,
        item.name || 'N/A',
        item.color || 'N/A',
        item.quantity || 0,
        `฿${(item.price || 0).toLocaleString()}`,
        `฿${((item.price || 0) * (item.quantity || 0)).toLocaleString()}`
      ]);

      // สร้างหัวตาราง
      autoTable(doc, {
        head: [["No.", "Product", "Color", "Qty", "Unit Price", "Total"]],
        body: rows,
        startY: 90,
        theme: "grid",
        styles: {
          font: "Sarabun",
          fontSize: 12,
          cellPadding: 3
        },
        headStyles: {
          font: "Sarabun",
          fontSize: 12,
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 20, right: 20 }
      });

      // คำนวณยอดรวม
      const subtotal = order.items.reduce((sum, item) =>
        sum + ((item.price || 0) * (item.quantity || 0)), 0
      );

      const finalY = doc.lastAutoTable.finalY + 10;

      // เส้นคั่นยอดรวม
      doc.setLineWidth(0.5);
      doc.line(20, finalY, 190, finalY);

      // ยอดรวม
      doc.setFontSize(16);
      doc.setFont("Sarabun", "bold");
      doc.text(`Total Amount: ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} THB`, 20, finalY + 15);


      // Footer
      doc.setFont("Sarabun", "normal");
      doc.setFontSize(10);
      doc.text("ขอบคุณที่ใช้บริการ / Thank you for your purchase", 20, finalY + 35);
      doc.text(`สร้างเมื่อ: ${formatDate()}`, 20, finalY + 45);

      // บันทึกไฟล์
      const filename = `receipt_${order.orderId || Date.now()}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้ง");
    }
  };

  // คำนวณยอดรวม
  const totalAmount = order.items.reduce((sum, item) =>
    sum + ((item.price || 0) * (item.quantity || 0)), 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl px-8 py-8 shadow-xl min-w-[340px] max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-green-600 text-2xl font-bold text-center mb-4">
          ✅ Order Successful!
        </div>
        <div className="text-gray-600 text-center mb-6">Order Successful</div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-center mb-2 text-sm text-gray-600">
            Order ID
          </div>
          <div className="text-center font-mono text-lg font-bold text-blue-600">
            {order.orderId || 'N/A'}
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center justify-center gap-3 mb-6 bg-blue-50 rounded-lg p-3">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full border-2 border-blue-200"
            />
          )}
          <div>
            <div className="font-semibold text-gray-800">
              {user?.username || "Guest"}
            </div>
            <div className="text-sm text-gray-600">Customer</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
            Order Items
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      สี: {item.color || 'N/A'} | Quantity: {item.quantity || 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {formatCurrency((item.price || 0) * (item.quantity || 0))}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{formatCurrency(item.price || 0)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total Amount:</span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">
            Total Amount
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className="cursor-pointer block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-200 shadow-md"
            onClick={handleDownloadPDF}
          >
            📄 Download Receipt (PDF)
          </button>
          <button
            className="cursor-pointer block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors duration-200"
            onClick={onBack}
          >
            🏪 Back to Store
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-4">
          Date created: {formatDate()}
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;