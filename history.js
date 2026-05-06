import settings from './settings.json' with { type: 'json' };

const historyBody = document.getElementById('history-body');
const loadBtn = document.getElementById('load-history');
const monthFilterInput = document.getElementById('month-filter');
const totalAmountDisplay = document.getElementById('total-received-amount');

let allHistoryData = []; // Database က Data တွေ ယာယီသိမ်းထားဖို့

async function fetchHistory2() {
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

async function fetchHistory() {
    historyBody.innerHTML = "<tr><td colspan='7' class='px-6 py-4 text-center'>Loading...</td></tr>";
    try {
        const q = window.query(window.collection(window.db, settings.db_name), window.orderBy("date", "desc"));
        const querySnapshot = await window.getDocs(q);
        
        allHistoryData = []; // အဟောင်းတွေဖျက်ပြီး အသစ်ပြန်ထည့်မယ်

        querySnapshot.forEach((doc) => {
            allHistoryData.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Data ရလာပြီဆိုရင် Table ကို စဆွဲပါမယ်
        renderTable();

    } catch (e) {
        console.error(e);
        historyBody.innerHTML = "<tr><td colspan='7' class='px-6 py-4 text-center text-red-500'>Error loading data!</td></tr>";
    }
}

function renderTable() {
    historyBody.innerHTML = ""; 
    let totalReceived = 0; // Total တွက်ဖို့
    const selectedMonth = monthFilterInput.value; // format: "YYYY-MM" (eg. "2023-10")

    allHistoryData.forEach((data) => {
        let rowDateObj = data.date?.toDate ? data.date.toDate() : null;
        let showRow = true;

        // Filter လအလိုက် စစ်ထုတ်ခြင်း
        if (selectedMonth && rowDateObj) {
            const year = rowDateObj.getFullYear();
            // လကို 2 digit ဖြစ်အောင် padStart သုံးပါတယ် (01, 02, etc.)
            const month = String(rowDateObj.getMonth() + 1).padStart(2, '0');
            const rowMonthStr = `${year}-${month}`; // "2023-10" ပုံစံဖြစ်သွားအောင်ပါ
            
            if (rowMonthStr !== selectedMonth) {
                showRow = false; // ရွေးထားတဲ့လနဲ့ မတူရင် မပြဘူး
            }
        }

        // ပြရမယ့် Row တွေကိုပဲ Table ထဲထည့်မယ်၊ Total ပေါင်းမယ်
        if (showRow) {
            const displayDate = rowDateObj ? rowDateObj.toLocaleDateString() : "N/A";
            
            // Total amount ထဲကို ပေါင်းထည့်မယ်
            const amount = Number(data.receivedAmount) || 0;
            totalReceived += amount;

            const tr = document.createElement('tr');
            tr.style.background = "white";
            tr.classList.add('border-b', 'hover:bg-gray-50'); // UI နည်းနည်းပြင်ထားပါတယ်
            tr.innerHTML = `
                <td class="px-6 py-4">${displayDate}</td>
                <td class="px-6 py-4 text-nowrap">${data.studentName}</td>
                <td class="px-6 py-4">${data.course}</td>
                <td class="px-6 py-4">${data.duration}</td>
                <td class="px-6 py-4">${Number(data.totalFee || 0).toLocaleString()}</td>
                <td class="px-6 py-4">${amount.toLocaleString()}</td>
                <td class="px-6 py-4">
                    <a href="template.html?id=${data.id}" class="edit-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded mr-2" >Print</a>
                    <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded" data-id="${data.id}">Delete</button>
                </td>
            `;
            
            historyBody.appendChild(tr);
        }
    });

    // Total Amount ကို UI မှာ သွားပြပါမယ်
    totalAmountDisplay.innerText = totalReceived.toLocaleString();
}

// ခလုတ်နှိပ်ရင် history ပြန်ယူမယ်
loadBtn.addEventListener('click', fetchHistory);

// Filter မှာ လ ရွေးလိုက်ရင် Table ကို အသစ်ပြန်ဆွဲမယ်
monthFilterInput.addEventListener('change', renderTable);

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
    // Delete Button လေးကို ဖျက်နေတုန်း Disable လုပ်ထားမယ်
    const deleteBtn = rowElement.querySelector('.delete-btn');
    deleteBtn.innerText = "Deleting...";
    deleteBtn.disabled = true;

    try {
        const docRef = window.doc(window.db, settings.db_name, id);
        await window.deleteDoc(docRef);
        
        // ဖျက်လို့အောင်မြင်ရင် Local Array ထဲကနေပါ ဖယ်ထုတ်လိုက်မယ်
        allHistoryData = allHistoryData.filter(item => item.id !== id);
        
        // Table နဲ့ Total ကို အသစ်ပြန် Update လုပ်မယ်
        renderTable(); 
        
    } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete.");
        deleteBtn.innerText = "Delete";
        deleteBtn.disabled = false;
    }
}