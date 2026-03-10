import settings from './settings.json' with { type: 'json' };

const receiptForm = document.getElementById('receiptForm');

// ၁။ URL ကနေ ID ကို ဖတ်မယ်
const params = new URLSearchParams(window.location.search);
const receiptId = params.get('id');

if (receiptId) {
    fetchReceiptData(receiptId);
}

// ၂။ Firebase ကနေ Data Fetch မယ့် Function
async function fetchReceiptData(id) {
    const docRef = doc(db, settings.db_name, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data);
        const displayDate = data.date?.toDate ? data.date.toDate().toLocaleDateString() : data.date;

        // HTML ထဲ Data ထည့်မယ်
        document.getElementById('studentName').value = data.studentName;
        document.getElementById('course').value = data.course;
        document.getElementById('duration').value = data.duration;
        document.getElementById('totalFee').value = data.totalFee;
        document.getElementById('receivedAmount').value = data.receivedAmount;
        // document.getElementById('date').value = displayDate;
        // document.getElementById('id').value = id.substring(0, 8).toUpperCase();
    } else {
        alert("No such receipt found!");
    }
}

// အရင်က ရေးခဲ့တဲ့ Form submit event ထဲမှာ ပြင်ပါမယ်
receiptForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const course = document.getElementById('course').value;
    const duration = document.getElementById('duration').value;
    const totalFee = document.getElementById('totalFee').value;
    const receivedAmount = document.getElementById('receivedAmount').value;
    const today = new Date().toLocaleDateString();

    try {
        // ၁။ Firebase ထဲ သိမ်းမယ်
        const docRef = doc(db, settings.db_name, receiptId);
        
        const res = await window.updateDoc(docRef, {
            studentName: studentName,
            course: course,
            duration: Number(duration),
            totalFee: Number(totalFee),
            receivedAmount: Number(receivedAmount),
        })

        window.location.href = `template.html?id=${receiptId}`;

    } catch (e) {
        console.error("Error:", e);
        alert("Something went wrong!");
    }
});

