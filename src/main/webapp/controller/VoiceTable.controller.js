sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
    ], function(jQuery, Controller, JSONModel , Filter, FilterOperator) {
	"use strict";

	var ListController = Controller.extend("sap.ui.ipcc.wt.controller.VoiceTable", {

		onInit: function(oEvent) {

			// create and set JSON Model
			//this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			this.oModel = new JSONModel();
			this.getView().setModel(this.oModel);

			this.getView().setModel(new JSONModel({
        		globalFilter: "",
        		availabilityFilterOn: false,
        		cellFilterOn: false
        	}), "ui");

        	this._oGlobalFilter = null;
        	this._oPriceFilter = null;
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
        			new Filter("customer_type", FilterOperator.Contains, sQuery)
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
		}

	});



	return ListController;

});
