sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
	"use strict";

	return UIComponent.extend("sap.ui.ipcc.wt.Component", {

		metadata : {
			manifest: "json",
			dependencies : {
            				libs : [
            					"sap.ui.table",
            					"sap.ui.unified",
            					"sap.m"
            				]
            			},
		},

		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set data model
			var oData = {
				recipient : {
					name : "World"
				}
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);

			// set i18n model
            var i18nModel = new ResourceModel({
                bundleName : "sap.ui.ipcc.wt.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");

			// debug code to show an alert for missing destination or CORS issues in the tutorial (see step 26 for details)
			//this.getModel("invoice").attachEventOnce("metadataFailed", function(oEvent) {
				/*eslint-disable no-alert */
			//	alert("Request to the OData remote service failed.\nRead the Walkthrough Tutorial Step 26 to understand why you don't see any data here.");
				/*eslint-enable no-alert */
			//});

            // Routing
            // create the views based on the url/hash
            this.getRouter().initialize();
		},

	});

});