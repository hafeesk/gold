# -*- coding: utf-8 -*-
# Copyright (c) 2019, Hardik Gadesha and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class DailyGoldPrice(Document):
	pass

@frappe.whitelist(allow_guest=True)
def getRate(metal,customer_group,purity,date):
        mt = frappe.db.sql("""select price from `tabDaily Gold Price` where metal = %s and customer_group = %s and
				purity = %s and date = %s;""",(metal,customer_group,purity,date))
        return mt[0][0] if mt else 0.0

