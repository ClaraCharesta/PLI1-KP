// CLEAR
document.querySelector(".clear").onclick = () => {
  document.querySelectorAll("select, textarea").forEach(el => {
    el.value = "";
  });
};

// BACK
document.querySelector(".back").onclick = () => {
  window.history.back();
};

// SAVE
document.querySelector(".save").addEventListener("click", async () => {

  const payload = {
    no_ref: document.getElementById("no_ref").value,
    radioComm: document.getElementById("radioComm").value,
    kunciMobil: document.getElementById("kunciMobil").value,
    kunciMotor: document.getElementById("kunciMotor").value,
    kunciSubst: document.getElementById("kunciSubst").value,
    toolset: document.getElementById("toolset").value
  };

  try {

    const res = await fetch("/stt/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      alert("STT berhasil disimpan");
    } else {
      alert(data.message);
    }

  } catch (err) {
    alert("Server tidak merespon");
  }

});
