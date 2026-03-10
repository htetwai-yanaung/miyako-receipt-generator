const historyBody = document.getElementById('history-body');
const loadBtn = document.getElementById('load-history');
import settings from './settings.json' with { type: 'json' };

async function fetchHistory() {
    historyBody.innerHTML = "Loading...";
    try {
        // အချိန်အလိုက် နောက်ဆုံးရောင်းရငွေကို ထိပ်ဆုံးက ထားမယ် (desc)
        const q = window.query(window.collection(window.db, settings.db_name), window.orderBy("date", "desc"));
        const querySnapshot = await window.getDocs(q);
        
        historyBody.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;
            const displayDate = data.date?.toDate ? data.date.toDate().toLocaleDateString() : "N/A";

            // Row တစ်ခုချင်းစီကို နှိပ်လို့ရအောင် onclick ထည့်ပါမယ်
            const tr = document.createElement('tr');
            tr.id = "tr-container";
            tr.style.cursor = "pointer";
            tr.style.background = "white";
            tr.classList.add('bg-red-400','hover:bg-gray-100')
            tr.innerHTML = `
                <td class="px-6 py-4">${displayDate}</td>
                <td class="px-6 py-4 text-nowrap">${data.studentName}</td>
                <td class="px-6 py-4">${data.course}</td>
                <td class="px-6 py-4">${data.duration}</td>
                <td class="px-6 py-4">${data.totalFee.toLocaleString()}</td>
                <td class="px-6 py-4">${data.receivedAmount.toLocaleString()}</td>
                <td class="px-6 py-4">
                    <a href="template.html?id=${docId}" class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" >Print</a>
                    <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-id="${docId}">Delete</button>
                </td>
            `;
            
            // Row ကို နှိပ်ရင် Receipt ပြန်ပြမယ့် Event
            // tr.onclick = () => {
            //     const url = `template.html?name=${encodeURIComponent(data.studentName)}&receivedAmount=${data.receivedAmount}&date=${displayDate}&id=${docId}`;
            //     window.location.href = url; // Page အသစ်ကို ကူးသွားမယ်
            // };

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

historyBody.addEventListener('click', async (event) => {
    // 1. Check if the clicked element is the delete button
    if (event.target.classList.contains('delete-btn')) {
        
        // Stop the click from "bubbling" up to the <tr> (important!)
        event.stopPropagation();

        const id = event.target.getAttribute('data-id');
        const confirmDelete = confirm("Are you sure you want to delete this record?");
        
        if (confirmDelete) {
            await deleteRow(id, event.target.closest('tr'));
        }
    }
});

async function deleteRow(id, rowElement) {
    try {
        // 1. Delete from Firebase
        const docRef = window.doc(window.db, settings.db_name, id);
        await window.deleteDoc(docRef);
        
        // 2. Remove from the HTML Table
        rowElement.remove();
        
        // alert("Deleted successfully!");
    } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete.");
    }
}