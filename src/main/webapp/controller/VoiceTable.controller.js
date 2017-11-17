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

    var _tableData = null;
    var HOST = "";

	var ListController = Controller.extend("sap.ui.ipcc.wt.controller.VoiceTable", {

		onInit: function(oEvent) {

			// create and set JSON Model
			//this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			var configModel = new JSONModel({});
            var url = jQuery.sap.getModulePath("sap.ui.demo.mock", "/config.json")
            configModel.loadData(url, "", false);
            this.getView().setModel(configModel, "config_model");
            HOST = configModel.getData().backend;
            console.log(HOST);

			this.oModel = this.initValue();
			this.getView().setModel(this.oModel);

			this.getView().setModel(new JSONModel({
        		globalFilter: "",
        		availabilityFilterOn: false,
        		cellFilterOn: false
        	}), "ui");

        	this._oGlobalFilter = null;
        	this._oPriceFilter = null;
        	this._searchDate = false;

            // Date
            this.getView().setModel(new JSONModel({
                "dateStart" : new Date(),
                "dateEnd" : new Date(),
                "dateFind": false
            }), "dateModel");

            // Table data temp
            var table = this.getView().byId("table");    //Get hold of Table
            table.addEventDelegate({                        //Table onAfterRendering event
                onAfterRendering: function() {
                    var oBinding = this.getBinding("rows");      //Get hold of binding aggregation "row"
                    oBinding.attachChange(function(oEvent) {     //Attach 'binding' change event which fires on filter / sort
                        var oSource = oEvent.getSource();
                        var oLength = oSource.getLength();
                        _tableData = oSource.aIndices;
                        // console.log(_tableData);
                    })
                }
            }, table);

            // host
            this.hostModel = this.getHostAddress();
            this.getView().setModel(this.hostModel, "host_model");
		},

		initValue(){
		    var oModel = new JSONModel();
		    // console.log(HOST)
		    jQuery.ajax({url: HOST + "/api/voicemail/all?search",
                dataType: "json",
                success: function(oData){
                    oModel.setData(oData);
                    var temp = [];
                    for(var i = 0; i < oData.length; i++) {
                        temp.push(i);
                    }
                    _tableData = temp;
                    // console.log(_tableData);
                },

                error: function () {
                    jQuery.sap.log.error("failed");
                }
            });

            return oModel;
		},

		getHostAddress(){
            var oModel = new JSONModel();
            jQuery.ajax({url: HOST + "/api/voicemail/gethost",
                success: function(oData){
                    oModel.setData({host_address: oData});
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
		},

		_filter : function () {
        	var oFilter = null;

       		if (this._oGlobalFilter && this._oPriceFilter) {
    			oFilter = new sap.ui.model.Filter([this._oGlobalFilter, this._oPriceFilter], true);
    		} else if (this._oGlobalFilter) {
    			oFilter = this._oGlobalFilter;
    		} else if (this._oPriceFilter) {
        		oFilter = this._oPriceFilter;
        	}

        	this.getView().byId("table").getBinding("rows").filter(oFilter, "Application");
       	},

       	filterGlobally : function(oEvent) {
        	var sQuery = oEvent.getParameter("query");
        	this._oGlobalFilter = null;

        	if (sQuery) {
        		this._oGlobalFilter = new Filter([
        			new Filter("customer_name", FilterOperator.Contains, sQuery),
        			new Filter("customer_type", FilterOperator.Contains, sQuery),
        			new Filter("customer_phone", FilterOperator.Contains, sQuery)
        		], false);
        	}

        	this._filter();
        },

        clearAllFilters : function(oEvent) {
        	var oTable = this.getView().byId("table");

        	var oUiModel = this.getView().getModel("ui");
        	oUiModel.setProperty("/globalFilter", "");
        	oUiModel.setProperty("/availabilityFilterOn", false);

        	this._oGlobalFilter = null;
        	this._oPriceFilter = null;
        	this._filter();

        	var aColumns = oTable.getColumns();
        	for (var i = 0; i < aColumns.length; i++) {
        		oTable.filter(aColumns[i], null);
        	}

        	// clear all sortings
        	oTable.getBinding("rows").sort(null);
        	this._resetSortingState();
        },

        toggleAvailabilityFilter : function(oEvent) {
        	this.getView().byId("availability").filter(oEvent.getParameter("pressed") ? "X" : "");
        },

        formatAvailableToObjectState : function (bAvailable) {
        	return bAvailable ? "Success" : "Error";
        },

		handlePress: function (evt) {
			var sSrc = evt.getSource().getTarget();
			var oDialog = new sap.m.Dialog({
				content: new sap.m.Image({
					src: sSrc
				}),
				beginButton: new sap.m.Button({
					text: 'Close',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});
			oDialog.open();
		},

		showFindDate: function (evt) {
		    var oDateModel = this.getView().getModel("dateModel");
            var findAllow = oDateModel.getProperty("/dateFind");
            oDateModel.setProperty("/dateFind", !findAllow);

            // Refresh default data
            if(findAllow == true && this._searchDate){
                this.oModel = this.initValue();
                this.getView().setModel(this.oModel);
                this.clearAllFilters();
                this._searchDate = false;
            }
		},

        findBetweenDate: function(evt){
            var dateStart = this.getView().byId("dateFrom").getValue();
            var dateEnd = this.getView().byId("dateTo").getValue();
            var d1 = dateStart.split("/");
            var d1Final = d1[2]+"-"+d1[1]+"-"+d1[0];
            var d2 = dateEnd.split("/");
            var d2Final = d2[2]+"-"+d2[1]+"-"+d2[0];
            var oView = this.getView();
            //alert(dateStart + " - " + dateEnd);

            jQuery.ajax({url: HOST + "/api/voicemail/all?search=date_record<" + d2Final + ",date_record>" + d1Final,
                dataType: "json",
                success: function(oData){
                    var oModel = new JSONModel();
                    oModel.setData(oData);
                    oView.setModel(oModel);
                    var temp = [];
                    for(var i = 0; i < oData.length; i++) {
                        temp.push(i);
                    }
                    _tableData = temp;
                    // console.log(_tableData);
                },

                error: function () {
                    jQuery.sap.log.error("failed");
                }
            });
            this._searchDate = true;
        },

        _resetSortingState : function() {
        	var oTable = this.getView().byId("table");
        	var aColumns = oTable.getColumns();
        	for (var i = 0; i < aColumns.length; i++) {
        	    aColumns[i].setSorted(false);
            }
        },

        clickLink: function(evt) {
            var id = evt.getSource().data("mydata");
            var link = evt.getSource().data("mydataLink");
            var name = evt.getSource().data("mydataName");
            var date = evt.getSource().data("mydataDate");
            var model = this.oModel;
            var mainModel = model.oData;
            var index = 0;
            for(var i = 0; i < mainModel.length; i++){
                if(mainModel[i].id == id){
                    index = i;
                    break;
                }
            }

            if(id != null) {
                jQuery.ajax({url: HOST + "/api/voicemail/update?id="+id+"&isSeen=1&note=''",
                    success: function(oData){
                        // console.log(oData)
                        mainModel[index].status_agent_seen = "1";
                        model.refresh();

                        // play media
                        var oDialog1 = new Dialog({
                            closed: function() {
                            	oDialog1.destroy();
                            }
                        });
                        oDialog1.setTitle(name+ " [ "+ date+" ] ");
                        oDialog1.addContent(new HTML("html_"+id, { content : "<iframe   src=" + link + "  width='400' height='300' ></iframe>"  }));
                        //oDialog1.setModal(true);
                        oDialog1.open();
                    },

                    error: function () {
                        jQuery.sap.log.error("failed");
                    }
                });
            }
        },

        saveNote: function(evt) {
            var id = evt.getSource().data("mydataInput");
            var dataInput = $('input[name='+id+']').val();

            var dialog1 = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({
                    text: 'Are you sure you want to save this note?'
                }),
                beginButton: new Button({
                    text: 'OK',
                    press: function () {
                        jQuery.ajax({url: HOST + "/api/voicemail/update?id="+id+"&isSeen=0&note="+dataInput+"",
                            success: function(oData){
                                // console.log(oData)
                                var dialog = new sap.m.Dialog({
                                    title: 'Success',
                                    type: 'Message',
                                    state: 'Success',
                                    content: new sap.m.Text({
                                        text: 'Update Note Success.'
                                    }),
                                    beginButton: new Button({
                                        text: 'OK',
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

                            error: function () {
                                jQuery.sap.log.error("failed");
                            }
                        });

                        dialog1.close();
                    }
                }),
                endButton: new Button({
                    text: 'Cancel',
                    press: function () {
                	    dialog1.close();
                    }
                }),
                afterClose: function() {
                    dialog1.destroy();
                }
            });

            dialog1.open();
        },

        // export
        exportTable: function(){
            var jsonData = this.oModel.oData;
            var table = this.getView().byId("table");
            var sPath = table.getBindingPath("rows");
            var oModelObject = table.getModel().getProperty(sPath);

            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({ text: 'Are you sure you want to export?' }),
                beginButton: new sap.m.Button({
                    text: 'Export',
                    press: function () {
                        var oExportData = [];
                        for(var i = 0; i < _tableData.length; i++) {
                            oExportData.push(oModelObject[_tableData[i]])
                        }
                        // console.log(oExportData);
                        if(oExportData.length == 0) {
                            MessageToast.show("No data to export!");
                            dialog.close();
                            return;
                        }

                        $.ajax({
                            contentType: 'application/ms-excel',
                            data: JSON.stringify(oExportData),
                            success: function(){
                                window.location = HOST + '/api/voicemail/result'
                            },
                            error: function(){
                                console.log("Export failed");
                            },
                            type: 'POST',
                            url: HOST + '/api/voicemail/export'
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

            //this.generateTableCSV(table, jsonData);
        },

        generateTableCSV: function(table, jsonData){
            for (var i =0; i<table.getColumns().length; i++) {
                var template = table.getColumns()[i].getTemplate();
                switch(i){
                    case 0:
                        template.bindProperty("text", "id");
                        break;
                    case 2:
                        template.bindProperty("text", "customer_name");
                        break;
                    case 3:
                        template.bindProperty("text", "customer_type");
                        break;
                    case 4:
                        template.bindProperty("text", "customer_phone");
                        break;
                    case 5:
                        template.bindProperty("text", "date_record");
                        break;
                    case 6:
                        template.bindProperty("text", "branch_call");
                        break;
                    case 8:
                        //template.bindProperty("value", "agent_note");
                        break;
                }
            }

            var info = "";

            for (var i =0; i<table.getColumns().length; i++) {
                info+= encodeURIComponent(table.getColumns()[i].getLabel().getText()) + ';';
            }

            info += '\r\n';

            if (jsonData.length != undefined) {
                for (var j=0; j<jsonData.length; j++) {
                    for (var i =0; i<table.getColumns().length; i++) {
                        if (table.getColumns()[i].getTemplate() != undefined && table.getColumns()[i].getTemplate().mBindingInfos.text!= undefined) {
                            var valor = eval('jsonData[j].'+table.getColumns()[i].getTemplate().mBindingInfos.text.parts[0].path);
                            info+= encodeURIComponent(valor) + ';';
                        } else
                            info+= ';';
                    }

                    info += '\r\n';
                }
            } else {
                $.each(jsonData, function(key,value){
                    for (var i =0; i<table.getColumns().length; i++) {
                        if (table.getColumns()[i].getTemplate() != undefined && table.getColumns()[i].getTemplate().mBindingInfos.text!= undefined) {
                            var valor = eval('jsonData[j].'+table.getColumns()[i].getTemplate().mBindingInfos.text.parts[0].path);
                            info+= encodeURIComponent(valor) + ';';
                        } else
                            info+= ';';
                    }

                    info += '\r\n';

                });

            }
            return info;
        }
	});

	return ListController;

});
