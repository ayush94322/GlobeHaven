const changeDateBtn = document.getElementById("changeDate");
const modal = document.getElementById("dateModal");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const changeGuestBtn = document.getElementById("changeGuest");
const guestModal = document.getElementById("guestModal");
const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const personNum = document.getElementById("personNum");

const policyLink = document.getElementById("policy");
const policyModal = document.getElementById("policyModal");

const dateTxt = document.getElementById("dateTxt");

window.onload = function () {
  const today = new Date().toISOString().split("T")[0];
  startDate.min = today;
  
};
startDate.addEventListener("change", function() {
    const start = new Date(this.value);
    start.setDate(start.getDate()+1);
    endDate.min = start.toISOString().split("T")[0];
});

changeDateBtn.onclick = ()=>{
    modal.style.display = "flex";
}
changeGuestBtn.onclick = ()=>{
    guestModal.style.display = "flex";
}
policyLink.onclick = ()=>{
    policyModal.style.display = "flex";
}

saveBtn.onclick = ()=>{
    const checkin = new Date(startDate.value);
    const checkout = new Date(endDate.value);
    dateTxt.innerHTML = `${checkin.toLocaleDateString("en-GB")} - ${checkout.toLocaleDateString("en-GB")}<br/>`;
    const diff = checkout.getTime() - checkin.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const nightsTxt= document.getElementById("nightsTxt")
    nightsTxt.innerText = "";
    nightsTxt.innerText = `${nights}`;
    const totalTxt = document.getElementById("totalTxt");
    totalTxt.innerHTML = "";
    totalTxt.innerHTML = `<b>&#8377;${(listing.price*nights).toLocaleString("en-IN")}</b>`;
    modal.style.display = "none";
}
addBtn.onclick = ()=>{
    const guests = personNum.value;
    const guestTxt = document.getElementById("guestTxt");
    guestTxt.innerText = "";
    guestTxt.innerHTML = `${guests} persons`;
    guestModal.style.display = "none";
}

clearBtn.onclick = ()=>{
    startDate.value = "";
    endDate.value = "";
}
cancelBtn.onclick = ()=>{
    personNum.value = "1";
    guestModal.style.display = "none";
}

window.onclick = (e)=>{
    if(e.target == modal) {
        modal.style.display = "none";
    }
    else if(e.target == guestModal) {
        guestModal.style.display = "none";
    }
    else if(e.target == policyModal) {
        policyModal.style.display = "none";
    }
}