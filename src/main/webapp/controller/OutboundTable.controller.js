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
], function (jQuery, Controller, JSONModel, Filter, FilterOperator, Dialog, Button, HTML, Export, ExportTypeCSV, MessageToast) {
    "use strict";

    var HOST = "http://localhost:"

    return Controller.extend("sap.ui.ipcc.wt.controller.OutboundTable", {

        onInit: function (oEvent) {

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

        initValue() {
            var oModel = new JSONModel();
            jQuery.ajax(jQuery.sap.getModulePath("sap.ui.demo.mock", "/Outbound.json"), {
                dataType: "json",
                success: function (oData) {
                    oModel.setData(oData);
                },

                error: function () {
                    jQuery.sap.log.error("failed to load json");
                }
            });

            return oModel;
        },

        getTableData(table, page) {
            var oModel = new JSONModel();
            jQuery.ajax({
                url: HOST + "/api/" + table + "/all?page=" + page,
                dataType: "json",
                success: function (oData) {
                    oModel.setData(oData);
                },

                error: function () {
                    jQuery.sap.log.error("failed");
                }
            });

            return oModel;
        },

        onExit: function () {
            // destroy the model
            this.oModel.destroy();
            this.tableModel.destroy();
            if (this._oPopover) {
                this._oPopover.destroy();
            }
            if (this._oReviewDialog) {
                this._oReviewDialog.destroy();
            }
            if (this._oHistoryDialog) {
                this._oHistoryDialog.destroy();
            }
        },

        handleValueChange: function (oEvent) {
            var _this = this;
            var fileName = oEvent.getParameter("newValue");
            if (fileName.length > 0) {
                var oFileUploader = this.getView().byId("fileUploader");
                if (oFileUploader.getValue()) {
                    var oUiModel = this.getView().getModel("selectModel");
                    var tableName = oUiModel.getProperty("/table");
                    var data = new FormData();
                    var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
                    data.append('file', file);
                    $.ajax({
                        success: function (result) {
                            if (result.length > 0) {
                                // Show Review Popup
                                _this.showReviewDialog(result, tableName);
                            } else {
                                MessageToast.show("Incorrect form. Please click 'Get Import Form' to see the correct form!");
                            }
                        },
                        error: function () {
                            console.log("Review failed");
                        },
                        type: 'POST',
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        mimeType: "multipart/form-data",
                        url: HOST + '/api/' + tableName + '/review'
                    });
                }
            } else {
                MessageToast.show("File is not selected!");
            }
        },

        handleReviewPress: function (oEvent) {
            var _this = this;
            var oFileUploader = this.getView().byId("fileUploader");
            if (oFileUploader.getValue()) {
                var oUiModel = this.getView().getModel("selectModel");
                var tableName = oUiModel.getProperty("/table");
                var data = new FormData();
                var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
                data.append('file', file);
                $.ajax({
                    success: function (result) {
                        if (result.length > 0) {
                            // Show Review Popup
                            _this.showReviewDialog(result, tableName);
                        } else {
                            MessageToast.show("Incorrect form. Please click 'Get Import Form' to see the correct form!");
                        }
                    },
                    error: function () {
                        console.log("Review failed");
                    },
                    type: 'POST',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    mimeType: "multipart/form-data",
                    url: HOST + '/api/' + tableName + '/review'
                });
            }
        },

        handleTypeMissmatch: function (oEvent) {
            var aFileTypes = oEvent.getSource().getFileType();
            jQuery.each(aFileTypes, function (key, value) {
                aFileTypes[key] = "*." + value;
            });
            var sSupportedFileTypes = aFileTypes.join(", ");
            MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                " is not supported. Choose one of the following types: " +
                sSupportedFileTypes);
        },

        handleUploadPress: function () {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            var oUiModel = this.getView().getModel("selectModel");
            if (selected > 0) {
                this.uploadFile();
            } else {
                this.showErrorPopover();
            }
        },

        handleUploadComplete: function (oEvent) {
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
                var response = sResponse.substring(sResponse.indexOf(">{") + 1, sResponse.indexOf("}<") + 1);
                this.getView().byId("result").setValue(response);
                var myJSON = JSON.parse(response);

                var page = myJSON.pages;
                if (page != null) {
                    this._totalPage = parseInt(page);
                }

                if (this._totalPage > 0) {
                    var oUiModel = this.getView().getModel("selectModel");
                    var tableName = oUiModel.getProperty("/table");
                    this._currentPage = 1;
                    this.tableModel = this.getTableData(tableName, this._currentPage);
                    this.getView().setModel(this.tableModel);
                    this.getView().byId("pageTextId").setText("Page " + this._currentPage);
                    var rs = "+ Import thành công: " + myJSON.success + "bản ghi" +
                        "\n+ Import lỗi: " + myJSON.fail + "bản ghi";
                    if (myJSON.error.length > 0)
                        rs += "\n+ Error: " + myJSON.error;
                    if (myJSON.contact_campaign.length > 0)
                        rs += "\n+ File import: " + myJSON.contact_campaign;
                    if (myJSON.date_campaign.length > 0)
                        rs += "\n+ Thời gian import: " + myJSON.date_campaign;
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
                if (selected == 1) {
                    this.getView().byId("table_birthday").setVisible(true);
                    this.getView().byId("table_survey").setVisible(false);
                    this.getView().byId("table_history").setVisible(false);
                } else if (selected == 2) {
                    this.getView().byId("table_birthday").setVisible(false);
                    this.getView().byId("table_survey").setVisible(true);
                    this.getView().byId("table_history").setVisible(false);
                }
            }
        },

        handleUploadComplete2: function (response) {
            this.getView().byId("result").setValue(response.toString());
            var myJSON = response;

            var page = myJSON.pages;
            if (page != null) {
                this._totalPage = parseInt(page);
            }

            if (this._totalPage > 0) {
                var oUiModel = this.getView().getModel("selectModel");
                var tableName = oUiModel.getProperty("/table");
                this._currentPage = 1;
                this.tableModel = this.getTableData(tableName, this._currentPage);
                this.getView().setModel(this.tableModel);
                this.getView().byId("pageTextId").setText("Page " + this._currentPage);
                var rs = "+ Import thành công: " + myJSON.success + "bản ghi" +
                    "\n+ Import lỗi: " + myJSON.fail + "bản ghi";
                if (myJSON.error.length > 0)
                    rs += "\n+ Error: " + myJSON.error;
                if (myJSON.contact_campaign.length > 0)
                    rs += "\n+ File import: " + myJSON.contact_campaign;
                if (myJSON.date_campaign.length > 0)
                    rs += "\n+ Thời gian import: " + myJSON.date_campaign;
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
            if (selected == 1) {
                this.getView().byId("table_birthday").setVisible(true);
                this.getView().byId("table_survey").setVisible(false);
                this.getView().byId("table_history").setVisible(false);
            } else if (selected == 2) {
                this.getView().byId("table_birthday").setVisible(false);
                this.getView().byId("table_survey").setVisible(true);
                this.getView().byId("table_history").setVisible(false);
            }
        },

        showErrorPopover: function () {
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

        showReviewDialog: function (result, tableName) {
            if (this._oReviewDialog) {
                this._oReviewDialog.destroy();
            }

            this._oReviewDialog = sap.ui.xmlfragment("reviewFragment", "sap.ui.ipcc.wt.view.ReviewFragment", this);
            this.getView().addDependent(this._oReviewDialog);
            var data = this.initReviewTable(tableName, result);
            this.reviewTable(tableName, data);
            this._oReviewDialog.open();
        },

        closeReviewButton: function (oEvent) {
            this._oReviewDialog.close();
        },

        showHistoryDialog: function () {
            if (this._oHistoryDialog) {
                this._oHistoryDialog.destroy();
            }

            //this._oHistoryDialog = sap.ui.xmlfragment("historyFragment", "sap.ui.ipcc.wt.view.HistoryFragment", this);
            //this.getView().addDependent(this._oHistoryDialog);

            var oUiModel = this.getView().getModel("selectModel");
            var tableName = oUiModel.getProperty("/table");
            var _this = this;
            $.ajax({
                success: function (result) {
                    var data = _this.initHistoryTable(result);
                    _this.historyTable(data);
                },
                error: function () {
                    console.log("Get History failed");
                },
                type: 'GET',
                url: HOST + '/api/' + tableName + '/history/'
            });
        },

        closeHistoryButton: function (oEvent) {
            this._oHistoryDialog.close();
        },

        reviewTable: function (table_name, data) {
            // instantiating the model of type json
            var oModel = new JSONModel();
            oModel.setData(data);
            // Set the model to Table
            var oTableBirthday = sap.ui.core.Fragment.byId("reviewFragment", "table_birthday");
            var oTableSurvey = sap.ui.core.Fragment.byId("reviewFragment", "table_survey");
            if (table_name == "birthday") {
                oTableBirthday.setVisible(true);
                oTableSurvey.setVisible(false);
            } else if (table_name == "survey") {
                oTableBirthday.setVisible(false);
                oTableSurvey.setVisible(true);
            }
            var oTable = sap.ui.core.Fragment.byId("reviewFragment", "table_" + table_name);
            oTable.setModel(oModel);
            // Template
            var oTemplate;
            // Birthday
            if (table_name == "birthday") {
                oTemplate = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({
                            text: "{id}"
                        }),
                        new sap.m.Text({
                            text: "{ten_don_vi}"
                        }),
                        new sap.m.Text({
                            text: "{ma_kh}"
                        }),
                        new sap.m.Text({
                            text: "{ten_kh}"
                        }),
                        new sap.m.Text({
                            text: "{sdt1}"
                        }),
                        new sap.m.Text({
                            text: "{sdt2}"
                        }),
                        new sap.m.Text({
                            text: "{ngay_sinh}"
                        }),
                        new sap.m.Text({
                            text: "{thang_sinh}"
                        }),
                        new sap.m.Text({
                            text: "{khut}"
                        }),
                        new sap.m.Text({
                            text: "{rank_kh}"
                        }),
                        new sap.m.Text({
                            text: "{hoa}"
                        }),
                        new sap.m.Text({
                            text: "{banh_kem}"
                        }),
                        new sap.m.Text({
                            text: "{nv_quan_ly}"
                        }),
                        new sap.m.Text({
                            text: "{check}"
                        })
                    ]
                });
            } else if (table_name == "survey") {
                oTemplate = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({
                            text: "{id}"
                        }),
                        new sap.m.Text({
                            text: "{ma_kh}"
                        }),
                        new sap.m.Text({
                            text: "{ten_kh}"
                        }),
                        new sap.m.Text({
                            text: "{sdt1}"
                        }),
                        new sap.m.Text({
                            text: "{sdt2}"
                        }),
                        new sap.m.Text({
                            text: "{acct_nbr}"
                        }),
                        new sap.m.Text({
                            text: "{chi_nhanh}"
                        }),
                        new sap.m.Text({
                            text: "{check}"
                        })
                    ]
                });
            }

            oTable.bindAggregation("items", {
                path: "/" + table_name,
                template: oTemplate
            })
        },

        initReviewTable: function (tableName, result) {
            var data = JSON.parse(result);
            // Birthday
            if (tableName == "birthday") {
                var init = [];
                for (var i = 0; i < data.length; i++) {
                    var row = {
                        "id": data[i][0],
                        "ten_don_vi": data[i][1],
                        "ma_kh": data[i][2],
                        "ten_kh": data[i][3],
                        "sdt1": data[i][4],
                        "sdt2": data[i][5],
                        "ngay_sinh": data[i][6],
                        "thang_sinh": data[i][7],
                        "khut": data[i][8],
                        "rank_kh": data[i][9],
                        "hoa": data[i][10],
                        "banh_kem": data[i][11],
                        "nv_quan_ly": data[i][12],
                        "check": data[i][17]
                    }
                    init.push(row);
                }

                var rs = {
                    "birthday": init
                }

                return rs;
            }

            // Survey
            if (tableName == "survey") {
                var init = [];
                for (var i = 0; i < data.length; i++) {
                    var row = {
                        "id": data[i][0],
                        "ma_kh": data[i][1],
                        "ten_kh": data[i][2],
                        "sdt1": data[i][3],
                        "sdt2": data[i][4],
                        "acct_nbr": data[i][5],
                        "chi_nhanh": data[i][6],
                        "check": data[i][11]
                    }
                    init.push(row);
                }

                var rs = {
                    "survey": init
                }

                return rs;
            }
        },

        historyTable: function (data) {
            // instantiating the model of type json
            var oModel = new JSONModel();
            oModel.setData(data);
            // Set the model to Table
            //var oTable = sap.ui.core.Fragment.byId("historyFragment", "table_history");
            var oTable = this.getView().byId("table_history");
            oTable.setModel(oModel);
            // Template
            /*var oTemplate = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({
                        text: "{ngay_import}"
                    }),
                    new sap.m.Text({
                        text: "{file_import}"
                    })
                ]
            });*/

            oTable.bindAggregation("rows", {
                path: "/history"
            })

            //this._oHistoryDialog.open();
            this.getView().byId("table_birthday").setVisible(false);
            this.getView().byId("table_survey").setVisible(false);
            this.getView().byId("table_history").setVisible(true);
        },

        initHistoryTable: function (data) {
            //var data = JSON.parse(result);
            var init = [];
            for (var i = 0; i < data.length; i++) {
                var row = {
                    "id": i,
                    "ngay_import": data[i][0],
                    "file_import": data[i][1]
                }
                init.push(row);
            }

            var rs = {
                "history": init
            }

            return rs;
        },

        uploadFile: function () {
            var oFileUploader = this.getView().byId("fileUploader");
            if (!oFileUploader.getValue()) {
                MessageToast.show("Choose a file first");
                return;
            }

            var oUiModel = this.getView().getModel("selectModel");
            var tableName = oUiModel.getProperty("/table");
            var _this = this;
            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({text: 'Are you sure you want to import this file?'}),
                beginButton: new sap.m.Button({
                    text: 'Import',
                    press: function () {
                        //oFileUploader.upload();
                        $.ajax({
                            success: function (result) {
                                _this.handleUploadComplete2(result)
                            },
                            error: function () {
                                console.log("Upload failed");
                            },
                            type: 'GET',
                            url: HOST + '/api/' + tableName + '/import/'
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
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();

        },

        handleDownloadPress: function () {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            if (selected == 0) {
                this.showErrorPopover();
                return;
            }

            var oUiModel = this.getView().getModel("selectModel");
            var tableName = oUiModel.getProperty("/table");
            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({text: 'Are you sure you want to download?'}),
                beginButton: new sap.m.Button({
                    text: 'Download',
                    press: function () {
                        $.ajax({
                            success: function (result) {
                                //MessageToast.show(result);
                                window.location = HOST + '/api/' + tableName + '/form'
                            },
                            error: function () {
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
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();
        },

        handleHistoryPress: function () {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            if (selected == 0) {
                this.showErrorPopover();
                return;
            }

            this.showHistoryDialog();
        },

        handleDeletePress: function (evt) {
            var date = evt.getSource().data("mydataDateImport");
            var file = evt.getSource().data("mydataFileImport");
            var oUiModel = this.getView().getModel("selectModel");
            var tableName = oUiModel.getProperty("/table");
            var _this = this;

            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({text: 'Are you sure you want to remove this?'}),
                beginButton: new sap.m.Button({
                    text: 'Remove',
                    press: function () {
                        $.ajax({
                            success: function (result) {
                                MessageToast.show(result);
                                _this.showHistoryDialog();
                            },
                            error: function () {
                                console.log("Delete failed");
                            },
                            type: 'GET',
                            url: HOST + '/api/' + tableName + '/remove?date=' + date + '&filename=' + file
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
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();
        },

        exportFile: function () {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            if (selected == 0) {
                this.showErrorPopover();
                return;
            }

            var oUiModel = this.getView().getModel("selectModel");
            var tableName = oUiModel.getProperty("/table");
            var dialog = new sap.m.Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new sap.m.Text({text: 'Are you sure you want to export?'}),
                beginButton: new sap.m.Button({
                    text: 'Export',
                    press: function () {
                        $.ajax({
                            success: function (result) {
                                //MessageToast.show(result);
                                window.location = HOST + '/api/' + tableName + '/export'
                            },
                            error: function () {
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
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();
        },

        nextPage: function () {
            if (this._currentPage < this._totalPage) {
                this._currentPage++;
                var oUiModel = this.getView().getModel("selectModel");
                var tableName = oUiModel.getProperty("/table");
                this.tableModel = this.getTableData(tableName, this._currentPage);
                this.getView().setModel(this.tableModel);
                this.getView().byId("pageTextId").setText("Page " + this._currentPage);
            }
        },

        prevPage: function () {
            if (this._currentPage > 1) {
                this._currentPage--;
                var oUiModel = this.getView().getModel("selectModel");
                var tableName = oUiModel.getProperty("/table");
                this.tableModel = this.getTableData(tableName, this._currentPage);
                this.getView().setModel(this.tableModel);
                this.getView().byId("pageTextId").setText("Page " + this._currentPage);
            }
        },

        handleComboboxChange: function () {
            var combobox = this.getView().byId("combobox");
            var selected = combobox.getSelectedKey();
            var oUiModel = this.getView().getModel("selectModel");
            var oFileUploader = this.getView().byId("fileUploader");

            if (selected == 0) {
                oUiModel.setProperty("/table", "");
                oFileUploader.setEnabled(false);
            } else if (selected == 1) {
                oUiModel.setProperty("/table", "birthday");
                oFileUploader.setEnabled(true);
            } else if (selected == 2) {
                oUiModel.setProperty("/table", "survey");
                oFileUploader.setEnabled(true);
            }

            oFileUploader.clear();
        }

    });

});
