const db = require("../models");
const BM = db.BasicMaintenance;
const TS = db.TsKCM5;
const LaporanShift = db.LaporanShift;

// ================= NORMALIZE =================
function norm(v){
    return (v || "").toString().trim().toLowerCase();
}

// ================= HELPER =================
function groupCount(rows, field){
    const map = {};

    rows.forEach(r=>{
        const key = r[field];
        if(!key) return; // jangan hitung null biar pivot sesuai tampilan
        map[key] = (map[key] || 0) + 1;
    });

    const labels = Object.keys(map);
    const values = Object.values(map);

    return {
        labels,
        values,
        total: values.reduce((a,b)=>a+b,0) // ⭐ FIX TOTAL TENGAH
    };
}

// ================= BUILD KEPALA SHIFT (BM DRIVER) =================
function buildKepalaShift(bm, laporanShift){
    const result = [];

    // 1️⃣ count BM per no_ref
    const bmCount = {};
    bm.forEach(b=>{
        const ref = norm(b.no_ref);
        if(!ref) return;
        bmCount[ref] = (bmCount[ref] || 0) + 1;
    });

    // 2️⃣ index shift
    const shiftIndex = {};
    laporanShift.forEach(ls=>{
        shiftIndex[norm(ls.no_ref)] = ls;
    });

    // 3️⃣ mapping
    Object.entries(bmCount).forEach(([ref,count])=>{
        const ls = shiftIndex[ref];
        if(!ls) return;

        const kepala = ls.personil_841a || ls.personil_851a;
        if(!kepala) return;

        // 4️⃣ push sebanyak jumlah BM
        for(let i=0;i<count;i++){
            result.push({kepala_shift:kepala});
        }
    });

    return result;
}

// ================= PAGE =================
exports.page = async (req,res)=>{
    try{
        const bm = await BM.findAll({raw:true});
        const ts = await TS.findAll({raw:true});
        const laporanShift = await LaporanShift.findAll({raw:true});

        const kepalaShiftData = buildKepalaShift(bm, laporanShift);

        const charts={
            area:groupCount(bm,"area"),
            kepala:groupCount(kepalaShiftData,"kepala_shift"),
            durasi:groupCount(ts,"durasi"),
            frek:groupCount(ts,"klasifikasi_peralatan"),
            status:groupCount(bm,"status"),
            stop:groupCount(ts,"stop_alat")
        };

        res.render("pivotView",{charts,active:"chart"});

    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// ================= FILTER =================
exports.filter = async (req,res)=>{
    try{
        const {chartKey,selected}=req.body;

        const bm = await BM.findAll({raw:true});
        const ts = await TS.findAll({raw:true});
        const laporanShift = await LaporanShift.findAll({raw:true});

        let bmFiltered=[...bm];

        // ================= GLOBAL FILTER =================
        if(selected?.length){

            // ⭐ filter langsung di BM field
            if(chartKey==="area")
                bmFiltered=bmFiltered.filter(r=>selected.includes(r.area));

            if(chartKey==="status")
                bmFiltered=bmFiltered.filter(r=>selected.includes(r.status));

            // ⭐ filter kepala shift → convert ke BM via no_ref
            if(chartKey==="kepala"){
                const kepalaMap = buildKepalaShift(bm, laporanShift);

                const refAllowed=new Set();

                // cari no_ref yg kepala shift sesuai
                bm.forEach(b=>{
                    const ref = norm(b.no_ref);
                    const ls = laporanShift.find(l=>norm(l.no_ref)===ref);
                    const kepala = ls?.personil_841a || ls?.personil_851a;
                    if(selected.includes(kepala)) refAllowed.add(ref);
                });

                bmFiltered=bmFiltered.filter(b=>refAllowed.has(norm(b.no_ref)));
            }

            // ⭐ filter TS driven → convert ke BM via no_ref
            if(chartKey==="durasi" || chartKey==="frek" || chartKey==="stop"){

                const tsFiltered = ts.filter(t=>{
                    if(chartKey==="durasi") return selected.includes(t.durasi);
                    if(chartKey==="frek") return selected.includes(t.klasifikasi_peralatan);
                    if(chartKey==="stop") return selected.includes(t.stop_alat);
                });

                const refAllowed=new Set(tsFiltered.map(t=>norm(t.no_ref)));

                bmFiltered=bmFiltered.filter(b=>refAllowed.has(norm(b.no_ref)));
            }
        }

        // ================= BUILD DATASET FINAL =================
        const refSet=new Set(bmFiltered.map(b=>norm(b.no_ref)));

        const tsFiltered=ts.filter(t=>refSet.has(norm(t.no_ref)));

        const kepalaRows=buildKepalaShift(bmFiltered, laporanShift);

        const charts={
            area:groupCount(bmFiltered,"area"),
            kepala:groupCount(kepalaRows,"kepala_shift"),
            durasi:groupCount(tsFiltered,"durasi"),
            frek:groupCount(tsFiltered,"klasifikasi_peralatan"),
            status:groupCount(bmFiltered,"status"),
            stop:groupCount(tsFiltered,"stop_alat")
        };

        res.json(charts);

    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"});
    }
};