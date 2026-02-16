// CLEAR
document.querySelector(".clear").onclick = () => {
  document.getElementById("catatan").value = "";
};

// BACK
document.querySelector(".back").onclick = () => {
  window.history.back();
};

// SAVE
document.querySelector(".save").addEventListener("click", async (e) => {
  e.preventDefault(); // 🔥 WAJIB

  const no_ref = document.getElementById("no_ref").value;
  const catatan = document.getElementById("catatan").value;

  try {
    const res = await fetch("/catatan/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ no_ref, catatan })
    });

    const data = await res.json();

    if (data.success) {
      alert("Catatan berhasil disimpan");
    }

  } catch (err) {
    alert("Server tidak merespon");
  }
});

