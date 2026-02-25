const historyBody = document.getElementById('history-body');
const loadBtn = document.getElementById('load-history');

async function fetchHistory() {
    historyBody.innerHTML = "Loading...";
    try {
        // အချိန်အလိုက် နောက်ဆုံးရောင်းရငွေကို ထိပ်ဆုံးက ထားမယ် (desc)
        const q = window.query(window.collection(window.db, "receipts"), window.orderBy("date", "desc"));
        const querySnapshot = await window.getDocs(q);
        
        historyBody.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;
            const displayDate = data.date?.toDate ? data.date.toDate().toLocaleDateString() : "N/A";

            // Row တစ်ခုချင်းစီကို နှိပ်လို့ရအောင် onclick ထည့်ပါမယ်
            const tr = document.createElement('tr');
            tr.style.cursor = "pointer";
            tr.style.background = "white";
            tr.classList.add('bg-red-400','hover:bg-gray-100')
            tr.innerHTML = `
                <td class="px-6 py-4">${displayDate}</td>
                <td class="px-6 py-4">${data.studentName}</td>
                <td class="px-6 py-4">${data.course}</td>
                <td class="px-6 py-4">${data.duration}</td>
                <td class="px-6 py-4">${data.totalFee.toLocaleString()}</td>
                <td class="px-6 py-4">${data.receivedAmount.toLocaleString()}</td>
            `;
            
            // Row ကို နှိပ်ရင် Receipt ပြန်ပြမယ့် Event
            tr.onclick = () => {
                const url = `template.html?name=${encodeURIComponent(data.studentName)}&receivedAmount=${data.receivedAmount}&date=${displayDate}&id=${docId}`;
                window.location.href = url; // Page အသစ်ကို ကူးသွားမယ်
            };

            historyBody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

// Receipt ပြန်ပြပေးမယ့် Function (Re-usable ဖြစ်အောင် ခွဲရေးတာပါ)
function showReceipt(name, receivedAmount, date, id) {
    document.getElementById('r-name').innerText = name;
    document.getElementById('r-receivedAmount').innerText = receivedAmount + " MMK";
    document.getElementById('r-total').innerText = receivedAmount;
    document.getElementById('r-date').innerText = date;
    document.getElementById('r-id').innerText = id.substring(0, 8).toUpperCase();

    document.getElementById('receipt-container').style.display = 'block';
    
    // Receipt ပေါ်လာတဲ့နေရာကို Screen အလိုအလျောက် ရွှေ့ပေးမယ်
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ခလုတ်နှိပ်ရင် history ပြန်ယူမယ်
loadBtn.addEventListener('click', fetchHistory);

// စာမျက်နှာ စဖွင့်ချင်းမှာလည်း တစ်ခါယူထားမယ်
fetchHistory();