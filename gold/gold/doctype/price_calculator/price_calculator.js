// Copyright (c) 2020, Hardik Gadesha and contributors
// For license information, please see license.txt

frappe.ui.form.on('Price Calculator', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on('Price Calculator', {
    refresh: function(frm) {
        cur_frm.set_query("serial_no", function() {
        return {
            "filters": {
		        "item_code": frm.doc.item_code
            }
        };
    });
    }
});   

frappe.ui.form.on('Price Calculator',  'refresh_data',  function(frm) {
        frm.reload_doc();
});

frappe.ui.form.on("Price Calculator", {
  calculate: function(frm) {
    frappe.call({
    "method": "gold.gold.doctype.daily_gold_price.daily_gold_price.getRate",
args: {
metal: frm.doc.metal,
customer_group: frm.doc.customer_group,
purity: frm.doc.purity,
date: frm.doc.date
},
callback:function(r){
    console.log(r.message);
	frm.set_value("metal_rate",r.message);
	var weight = frm.doc.weight - (frm.doc.stone_weight + frm.doc.other_weight);
	var net_weight = weight * (frm.doc.purity / 100);
	frm.set_value("total_metal",net_weight);
	frm.set_value("metal_with_wastage",net_weight);
	frm.set_value("total_price",net_weight * frm.doc.metal_rate);
	}
    });
}
});

frappe.ui.form.on('Price Calculator',  'wastage',  function(frm) {
        var extra = frm.doc.purity + frm.doc.wastage;
        console.log(extra);
        var weight = frm.doc.weight - (frm.doc.stone_weight + frm.doc.other_weight);
        var net = weight * (extra / 100);
        console.log(net);
        frm.set_value("metal_with_wastage",net);
        frm.set_value("total_price",frm.doc.metal_with_wastage * frm.doc.metal_rate);
});
