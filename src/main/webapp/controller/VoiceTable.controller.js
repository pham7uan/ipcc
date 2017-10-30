sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/commons/Dialog",
	"sap/ui/core/HTML"
    ], function(jQuery, Controller, JSONModel , Filter, FilterOperator, Dialog, HTML) {
	"use strict";

	var ListController = Controller.extend("sap.ui.ipcc.wt.controller.VoiceTable", {

		onInit: function(oEvent) {

			// create and set JSON Model
			//this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
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
		},

		initValue(){
		    var oModel = new JSONModel();
		    jQuery.ajax({url: "http://localhost:8080/api/voicemail/all?search",
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

            jQuery.ajax({url: "http://localhost:8080/api/voicemail/all?search=date_record<" + d2Final + ",date_record>" + d1Final,
                dataType: "json",
                success: function(oData){
                    var oModel = new JSONModel();
                    oModel.setData(oData);
                    oView.setModel(oModel);
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
                jQuery.ajax({url: "http://localhost:8080/api/voicemail/update?id="+id,
                    success: function(oData){
                        console.log(oData)
                        mainModel[index].status_agent_seen = "1";
                        model.refresh();

                        // play media
                        var oDialog1 = new Dialog({
                            closed: function() {
                            	oDialog1.destroy();
                            }
                        });
                        oDialog1.setTitle(name+ " [ "+ date+" ] ");
                        oDialog1.addContent(new HTML("html1", { content : "<iframe   src=" + link + "  width='400' height='300' ></iframe>"  }));
                        //oDialog1.setModal(true);
                        oDialog1.open();
                    },

                    error: function () {
                        jQuery.sap.log.error("failed");
                    }
                });
            }
        }
	});

	return ListController;

});
