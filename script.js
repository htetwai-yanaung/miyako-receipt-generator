import settings from './settings.json' with { type: 'json' };

const receiptForm = document.getElementById('receiptForm');

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
        const docRef = await window.addDoc(window.collection(window.db, settings.db_name), {
            studentName: studentName,
            course: course,
            duration: Number(duration),
            totalFee: Number(totalFee),
            receivedAmount: Number(receivedAmount),
            date: window.serverTimestamp()
        });
        console.log(docRef);

        window.location.href = `template.html?id=${docRef.id}`;

        // // ၂။ Receipt Template ထဲကို Data တွေ လှမ်းထည့်မယ်
        // document.getElementById('r-name').innerText = studentName;
        // document.getElementById('r-amount').innerText = receivedAmount + " MMK";
        // document.getElementById('r-total').innerText = receivedAmount;
        // document.getElementById('r-date').innerText = today;
        // document.getElementById('r-id').innerText = docRef.id.substring(0, 8).toUpperCase(); // ID အတိုလေးယူမယ်

        // // ၃။ Hidden ဖြစ်နေတဲ့ Receipt Container ကို ဖော်ပြမယ်
        // document.getElementById('receipt-container').style.display = 'block';
        
        // Form ကို clear ပြန်လုပ်မယ်
        // receiptForm.reset();
        // alert("Data Saved & Receipt Generated!");

    } catch (e) {
        console.error("Error:", e);
        alert("Something went wrong!");
    }
});

