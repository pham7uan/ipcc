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

    var HOST = "http://localhost:"

	return Controller.extend("sap.ui.ipcc.wt.controller.OutboundTable", {

		onInit: function(oEvent) {

            var configModel = new JSONModel({});
            var url = jQuery.sap.getModulePath("sap.ui.demo.mock", "/config.json")
            configModel.loadData(url, "", false);
            this.getView().setModel(configModel, "config_model");
            HOST = configModel.getData().backend;

			// create and set JSON Model
			//this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			this.oModel = this.initValue();
			//this.getView().setModel(this.oModel);

            // combo box
            var combobox = this.getView().byId("combobox");
            combobox.setModel(this.oModel);
            var oItemTemplate = new sap.ui.core.ListItem();
            oItemTemplate.bindProperty("key", "id");
            oItemTemplate.bindProperty("text", "name");
            combobox.bindItems("/OutboundTables", oItemTemplate);

			// Select table
			this.getView().setModel(new JSONModel({
                "table": ""
            }), "selectModel");

            // Table Data
            this.tableModel = new JSONModel();
            this.getView().setModel(this.tableModel);

            this._currentPage = 0;
            this._totalPage = 0;

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

		getTableData(table, page){
            var oModel = new JSONModel();
            jQuery.ajax({url: HOST + "/api/" + table + "/all?page=" + page,
                dataType: "json",
                success: function(oData){
                    oModel.setData(oData);
                },

                error: function () {
                    jQuery.sap.log.error("failed");
                }
            });

            return oModel;
        },

		onExit : function() {
			// destroy the model
			this.oModel.destroy();
			this.tableModel.destroy();
			if (this._oPopover) {
                this._oPopover.destroy();
            }
		},

		handleValueChange: function(oEvent) {
        	MessageToast.show("Press 'Import File' to import file '" +
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
		    var oUiModel = this.getView().getModel("selectModel");
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
        		var response = sResponse.substring(sResponse.indexOf(">{")+1, sResponse.indexOf("}<") + 1);
                this.getView().byId("result").setValue(response);
                var myJSON = JSON.parse(response);

                var page = myJSON.pages;
                if(page != null) {
                    this._totalPage = parseInt(page);
                }

                if(this._totalPage > 0) {
                    var oUiModel = this.getView().getModel("selectModel");
                    var tableName = oUiModel.getProperty("/table");
                    this._currentPage = 1;
                    this.tableModel = this.getTableData(tableName,this._currentPage);
                    this.getView().setModel(this.tableModel);
                    this.getView().byId("pageTextId").setText("Page "+ this._currentPage);
                    var rs = "+ Import Success: "+myJSON.success +
                             "\n+ Import Fail: "+myJSON.fail;
                    if(myJSON.error.length > 0)
                        rs+="\n+ Error: "+myJSON.error;
                    this.getView().byId("result").setValue("-- RESULT --\n\n" + rs);
                } else {
                    this._currentPage = 0;
                    this._totalPage = 0;
                    this.tableModel = new JSONModel();
                    this.getView().setModel(this.tableModel);
                    this.getView().byId("pageTextId").setText("Page 1");

                    this.getView().byId("result").setValue("-- ERROR --\n\n" + myJSON.error);
                }
        		//MessageToast.show(sResponse);

        		var selected = this.getView().byId("combobox").getSelectedKey();
        		if(selected == 1) {
                    this.getView().byId("table_birthday").setVisible(true);
                    this.getView().byId("table_survey").setVisible(false);
                } else if(selected == 2) {
                    this.getView().byId("table_birthday").setVisible(false);
                    this.getView().byId("table_survey").setVisible(true);
                }
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
            	content: new sap.m.Text({ text: 'Are you sure you want to import this file?' }),
            	beginButton: new sap.m.Button({
            	    text: 'Import',
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

        handleDownloadPress : function() {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            if(selected == 0) {
                this.showErrorPopover();
                return;
            }

            var oUiModel = this.getView().getModel("selectModel");
            var tableName = oUiModel.getProperty("/table");
            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({ text: 'Are you sure you want to download?' }),
                beginButton: new sap.m.Button({
                    text: 'Download',
                    press: function () {
                        $.ajax({
                            success: function(result){
                                //MessageToast.show(result);
                                window.location=HOST + '/api/' + tableName + '/form'
                            },
                            error: function(){
                                console.log("Download failed");
                            },
                            type: 'GET',
                            url: HOST + '/api/' + tableName + '/form'
                        });
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

        exportFile : function() {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            if(selected == 0) {
                this.showErrorPopover();
                return;
            }

            var oUiModel = this.getView().getModel("selectModel");
            var tableName = oUiModel.getProperty("/table");
            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({ text: 'Are you sure you want to export?' }),
                beginButton: new sap.m.Button({
                    text: 'Export',
                    press: function () {
                        $.ajax({
                            success: function(result){
                                //MessageToast.show(result);
                                window.location=HOST + '/api/' + tableName + '/export'
                            },
                            error: function(){
                                console.log("Export failed");
                            },
                            type: 'GET',
                            url: HOST + '/api/' + tableName + '/export'
                        });
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

        nextPage : function() {
            if(this._currentPage < this._totalPage) {
                this._currentPage ++;
                var oUiModel = this.getView().getModel("selectModel");
                var tableName = oUiModel.getProperty("/table");
                this.tableModel = this.getTableData(tableName,this._currentPage);
                this.getView().setModel(this.tableModel);
                this.getView().byId("pageTextId").setText("Page "+ this._currentPage);
            }
        },

        prevPage : function() {
            if(this._currentPage > 1) {
                this._currentPage --;
                var oUiModel = this.getView().getModel("selectModel");
                var tableName = oUiModel.getProperty("/table");
                this.tableModel = this.getTableData(tableName,this._currentPage);
                this.getView().setModel(this.tableModel);
                this.getView().byId("pageTextId").setText("Page "+ this._currentPage);
            }
        },

        handleComboboxChange : function() {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            var oUiModel = this.getView().getModel("selectModel");

            if(selected == 0) {
                oUiModel.setProperty("/table", "");
            } else if(selected == 1) {
                oUiModel.setProperty("/table", "birthday");
            } else if(selected == 2) {
                oUiModel.setProperty("/table", "survey");
            }

        }

	});

});
