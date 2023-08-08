sap.ui.define([
    "jquery/sap/global",
    "sap/ui/commons",
    "sap/ui/table/Table"
], function ($, Table) {
    "use strict";

    // $(function () {
        console.log(Table);
        return Table.extend('EditableTable', {
            renderer: function (oRm, oControl) {
                sap.ui.table.TableRenderer.render(oRm, oControl);
            },
            setRowEditable: function (edit, rowindex) {
                var model = this.getModel();
                var rowPath = this.getBindingInfo('rows').path;
                var rows = model.getProperty(rowPath);
                for (i = 0; i < rows.length; i++) {
                    row = rows[i];
                    if (i == rowindex) {
                        row[edit] = true; // make the selected row editable and rest non editable
                    } else {
                        row[edit] = false;
                    }
                }
                this.invalidate();
            }
        });
    //});
});