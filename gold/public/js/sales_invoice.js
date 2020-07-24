cur_frm.add_fetch('item_code',  'weight_per_unit','qty');
cur_frm.add_fetch('item_code',  'purity','purity');
cur_frm.add_fetch('item_code',  'labour_charge','labour_charge');
cur_frm.add_fetch('item_code',  'metal','metal');
cur_frm.add_fetch('item_code',  'has_fix_labour_charge','has_fix_labour_charge');
cur_frm.add_fetch('item_code',  'fix_labour_charge','fix_labour_charge');

frappe.ui.form.on("Sales Invoice Item",{
    "get_price" : function (frm, cdt, cdn){
        var d = locals[cdt][cdn];
        if(frm.doc.customer_group && d.purity && d.item_group){
            frappe.call({
                "method": "gold.gold.doctype.daily_gold_price.daily_gold_price.getRate",
                        args: {
                            metal: d.metal,
                            customer_group: frm.doc.customer_group,
                            purity: d.purity,
                            date: frm.doc.posting_date
                        },
                        callback:function(r){
                            console.log(r.message);
                            frappe.model.set_value(d.doctype, d.name, "rate", r.message );
                            if(d.get_price == 1 && d.has_fix_labour_charge){
                            var row = frm.add_child("items");
                            var pr = frm.doc.items[d.idx-1];
			                row.item_code = "Labour Charges";
			                row.item_name = "Labour Charges";
			                row.description = "Labour Charges";
       		                row.qty = pr.qty;
       		                row.rate = pr.fix_labour_charge;
       		                row.uom = "Gram";
       		                row.income_account = pr.income_account;
       		                row.amount = row.qty * row.rate;
                            }
       		                if(d.get_price == 1 && !d.has_fix_labour_charge){
                            var row = frm.add_child("items");
                            var pr = frm.doc.items[d.idx-1];
			                row.item_code = "Labour Charges";
			                row.item_name = "Labour Charges";
			                row.description = "Labour Charges";
       		                row.qty = pr.qty;
       		                row.rate = pr.labour_charge;
       		                row.uom = "Gram";
       		                row.income_account = pr.income_account;
       		                row.amount = row.qty * row.rate;
		                    cur_frm.refresh_field("items");
                }
                        }
            });
    }
    }
});

