// ---------------- CONTRACT UPLOAD + OCR ----------------
async function uploadContract() {
    const fileInput = document.getElementById("contractFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a contract file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Upload file
    const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData
    });

    const uploadData = await uploadRes.json();

    // OCR call
    const ocrRes = await fetch(
        `http://127.0.0.1:8000/ocr?filename=${uploadData.filename}`,
        { method: "POST" }
    );

    const ocrData = await ocrRes.json();

    document.getElementById("apr").innerText = ocrData.sla_summary.apr;
    document.getElementById("payment").innerText = ocrData.sla_summary.monthly_payment;
    document.getElementById("term").innerText = ocrData.sla_summary.term_months;
}

// ---------------- MARKET PRICE ----------------
async function estimatePrice() {
    const year = document.getElementById("year").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const credit = document.getElementById("credit").value;

    if (!year || !make || !model || !credit) {
        alert("Fill all fields");
        return;
    }

    const res = await fetch(
        `http://127.0.0.1:8000/market_fair_price?year=${year}&make=${make}&model=${model}&credit_score=${credit}`,
        { method: "POST" }
    );

    const data = await res.json();
    document.getElementById("price").innerText = data.estimated_price;
}

// ---------------- CAR RECOMMENDATION ----------------
async function recommendCar() {
    const credit = document.getElementById("rec_credit").value;

    if (!credit) {
        alert("Enter credit score");
        return;
    }

    const res = await fetch(
        `http://127.0.0.1:8000/recommendation/${credit}`
    );
    const data = await res.json();

    document.getElementById("segment").innerText =
        "Segment: " + data.segment;
    document.getElementById("suggestion").innerText =
        "Suggested: " + data.suggestion;

    showCarImage(data.segment);
}

// ---------------- IMAGE HANDLER ----------------
function showCarImage(segment) {
    const img = document.getElementById("carImage");

    // Step 1: fully hide
    img.classList.remove("show");
    img.style.opacity = "0";

    // Step 2: wait for browser to apply styles
    setTimeout(() => {
        if (segment === "Premium") {
            img.src = "/app/images/premium.jpg";
        } else if (segment === "Mid-range") {
            img.src = "/app/images/mid.jpg";
        } else {
            img.src = "/app/images/budget.jpg";
        }

        // Step 3: wait one more frame, then fade in
        setTimeout(() => {
            img.classList.add("show");
            img.style.opacity = "";
        }, 50);
    }, 50);
}


