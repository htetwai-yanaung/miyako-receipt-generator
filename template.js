

// ၁။ URL ကနေ ID ကို ဖတ်မယ်
const params = new URLSearchParams(window.location.search);
const receiptId = params.get('id');

if (receiptId) {
    fetchReceiptData(receiptId);
}

// ၂။ Firebase ကနေ Data Fetch မယ့် Function
async function fetchReceiptData(id) {
    const docRef = doc(db, "receipts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data);
        const displayDate = data.date?.toDate ? data.date.toDate().toLocaleDateString() : data.date;

        // HTML ထဲ Data ထည့်မယ်
        document.getElementById('r-name').innerText = data.studentName;
        document.getElementById('r-course').innerText = data.course;
        document.getElementById('r-duration').innerText = data.duration;
        document.getElementById('r-totalFee').innerText = data.totalFee.toLocaleString();
        document.getElementById('r-receivedAmount').innerText = data.receivedAmount.toLocaleString();
        document.getElementById('r-date').innerText = displayDate;
        document.getElementById('r-id').innerText = id.substring(0, 8).toUpperCase();
    } else {
        alert("No such receipt found!");
    }
}



document.getElementById('download-btn').onclick = () => {
    const receiptElement = document.getElementById('receipt-template');
    
    // ၁။ မူလရှိနေတဲ့ style တွေကို ခေတ္တသိမ်းထားမယ်
    const originalWidth = receiptElement.style.width;
    
    // ၂။ Download ဆွဲမယ့် size (ဖုန်း screen size) ကို အသေသတ်မှတ်မယ်
    receiptElement.style.width = "375px"; 
    
    html2canvas(receiptElement, {
        scale: 3, // ပုံကြည်လင်အောင် scale မြှင့်ထားပါ (High Resolution)
        width: 375, // Canvas ရဲ့ အကျယ်ကို အသေသတ်မှတ်
        windowWidth: 375, // Browser window အကျယ်ကို ၃၇၅ လို့ ယူဆခိုင်းတာ
        useCORS: true, // Logo ပုံတွေပါရင် အဆင်ပြေအောင်
        logging: false
    }).then(canvas => {
        // ၃။ ပုံထုတ်ပြီးရင် မူလ style ကို ပြန်ပြောင်းမယ်
        receiptElement.style.width = originalWidth;

        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = `receipt_${new Date().getTime()}.png`;
        link.click();
    });
};