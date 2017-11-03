sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/commons/Dialog",
	"sap/m/Button",
	"sap/ui/core/HTML",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageToast"
    ], function(jQuery, Controller, JSONModel , Filter, FilterOperator, Dialog, Button, HTML, Export, ExportTypeCSV, MessageToast) {
	"use strict";

    var HOST = "http://localhost:8080"

	return Controller.extend("sap.ui.ipcc.wt.controller.OutboundTable", {

		onInit: function(oEvent) {

			// create and set JSON Model
			//this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			this.oModel = this.initValue();
			this.getView().setModel(this.oModel);

		},

		initValue(){
		    var oModel = new JSONModel();
		    jQuery.ajax(jQuery.sap.getModulePath("sap.ui.demo.mock", "/Outbound.json"), {
                dataType: "json",
                success: function(oData){
                    oModel.setData(oData);
                },

                error: function () {
                    jQuery.sap.log.error("failed to load json");
                }
            });

            return oModel;
		},

		onExit : function() {
			// destroy the model
			this.oModel.destroy();
			if (this._oPopover) {
                this._oPopover.destroy();
            }
		},

		handleValueChange: function(oEvent) {
        	MessageToast.show("Press 'Upload File' to upload file '" +
        		    oEvent.getParameter("newValue") + "'");
        },

        handleTypeMissmatch: function(oEvent) {
            var aFileTypes = oEvent.getSource().getFileType();
        	jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
        	var sSupportedFileTypes = aFileTypes.join(", ");
        	MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
        	                    " is not supported. Choose one of the following types: " +
        					    sSupportedFileTypes);
        },

		handleUploadPress : function() {
		    var combobox = this.getView().byId("combobox");
		    var selected = combobox.getSelectedKey();
		    if(selected > 0) {
                this.uploadFile();
		    } else {
		        this.showErrorPopover();
		    }

		},

		handleUploadComplete: function(oEvent) {
            var sResponse = oEvent.getParameter("response");
        	if (sResponse) {
        	    /*var sMsg = "";
        		var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
        		if (m[1] == "200") {
        		    sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
        			oEvent.getSource().setValue("");
        		} else {
        		    sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
        		}*/
                this.getView().byId("result").setText(sResponse);
        		MessageToast.show(sResponse);
        	}
        },

		showErrorPopover : function() {
            if (!this._oPopover) {
            	this._oPopover = sap.ui.xmlfragment("sap.ui.ipcc.wt.view.PopoverFragment", this);
                this.getView().addDependent(this._oPopover);
            }

            var combobox = this.getView().byId("combobox");
            this._oPopover.openBy(combobox);
		},

		handleCloseButton: function (oEvent) {
            this._oPopover.close();
        },

        uploadFile: function() {
            var oFileUploader = this.getView().byId("fileUploader");
            if (!oFileUploader.getValue()) {
                MessageToast.show("Choose a file first");
            	return;
            }

            var dialog = new sap.m.Dialog({
            	title: 'Confirm',
            	type: 'Message',
            	content: new sap.m.Text({ text: 'Are you sure you want to upload this file?' }),
            	beginButton: new sap.m.Button({
            	    text: 'Upload',
            		press: function () {
            		    oFileUploader.upload();
            			dialog.close();
            		}
            	}),
            	endButton: new sap.m.Button({
            	    text: 'Cancel',
            		press: function () {
            		    dialog.close();
            		}
            	}),
            	afterClose: function() {
            	    dialog.destroy();
            	}
            });

            dialog.open();

        },


	});

});