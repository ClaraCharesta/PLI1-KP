const db = require("../models");

const BM = db.BasicMaintenance;
const TS = db.TsKCM5;


function group(rows, field){
    const map={};

    rows.forEach(r=>{
        const key = r[field] || "Unknown";
        map[key]=(map[key]||0)+1;
    });

    return {
        labels:Object.keys(map),
        values:Object.values(map),
        total:rows.length
    };
}


exports.page = async(req,res)=>{

    const bm = await BM.findAll({raw:true});
    const ts = await TS.findAll({raw:true});

    const charts={
        area: group(bm,"area"),
        kepala: group(bm,"pic"),
        durasi: group(ts,"durasi"),
        frek: group(ts,"klasifikasi_peralatan"),
        status: group(bm,"status"),
        stop: group(ts,"stop_alat")
    };

    res.render("pivotView",{
    charts,
    active: "chart"
});

};



exports.filter = async(req,res)=>{

    const {chartKey, selected} = req.body;

    const bm = await BM.findAll({raw:true});
    const ts = await TS.findAll({raw:true});

    const source = {
        area:{rows:bm,field:"area"},
        kepala:{rows:bm,field:"pic"},
        durasi:{rows:ts,field:"durasi"},
        frek:{rows:ts,field:"klasifikasi_peralatan"},
        status:{rows:bm,field:"status"},
        stop:{rows:ts,field:"stop_alat"}
    };

    let rows = source[chartKey].rows;
    let field = source[chartKey].field;

    // filter checkbox
    rows = rows.filter(r=>selected.includes(r[field]));

    res.json(group(rows,field));
};
