sap.ui.define([
	"zsapui5proj09fullscreen/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"zsapui5proj09fullscreen/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/ODataModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, ODataModel, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("zsapui5proj09fullscreen.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		_refresh: function() {
			this.onInit();
		}, //end of _refresh
		onInit: function() {
			var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";

			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			var dynamiccombojsonmodel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet", {

				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					//Table control
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");
					//Dynamic ComboBox control
					dynamiccombojsonmodel.setSizeLimit(1000);
					dynamiccombojsonmodel.setData(req.results);
					this.getView().byId("dynamiccomboid").setModel(dynamiccombojsonmodel, "cbprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1000:" + msg);

				}

			}); // end of read
		}, //end of onInit
		_orderByPriceAsc: function() {
			var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";

			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet?$orderby=Price", {

				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1000:" + msg);

				}

			}); // end of read
		}, //end of _orderByPriceAsc
		_orderByPriceDesc: function() {
			var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";

			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet?$orderby=Price desc", {

				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1000:" + msg);

				}

			}); // end of read
		}, //end of _orderByPriceDesc
		_staticdatacombo: function() {

			//this.byId("staticcomboid").mProperties.selectedKey;
			var keys = this.byId("staticcomboid").getSelectedKey();
			if (keys === "0") {
				this._refresh();
			}
			if (keys === "1") {
				this._orderByPriceAsc();
			}
			if (keys === "2") {
				this._orderByPriceDesc();
			}
		}, //end of _staticdatacombo
		_dynamiccombo: function(oevent) {
			var pid = oevent.getParameter("value");
	var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";
			debugger;
			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			var categoryfilter = new Filter("ProductID", FilterOperator.Contains, pid);

			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet", {
				filters: [categoryfilter],
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					//Table control
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1002:" + msg);

				}

			}); // end of read
		}, //end of _dynamiccombo

		_priceLessThanOrEqualTo1: function() {

			var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";

			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			var pricefilter = new Filter("Price", FilterOperator.LE, "1");
			//var pricefilter = new Filter("Price", FilterOperator.BT, "1","2");
			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet", {
				filters: [pricefilter],
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					//Table control
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1002:" + msg);

				}

			}); // end of read

		}, //end of _priceLessThanOrEqualTo1
		_categoryEqualToTrays: function() {

			var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";

			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			var categoryfilter = new Filter("Category", FilterOperator.Contains, "Trays");

			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet", {
				filters: [categoryfilter],
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					//Table control
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1002:" + msg);

				}

			}); // end of read

		}, //end of _categoryEqualToTrays
		_categoryTraysAndPrice320: function() {

			var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";

			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			var categoryfilter = new Filter("Category", FilterOperator.Contains, "Trays");
			var pricefilter = new Filter("Price", FilterOperator.EQ, "3.20");
			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet", {
				filters: [categoryfilter, pricefilter],
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					//Table control
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1002:" + msg);

				}

			}); // end of read

		}, //end of _categoryTraysAndPrice320

		_searchcategory: function(oevent) {

			//this.byId("idin1").mProperties.value;
			//oevent.mParameters.value;
			//var catname = this.byId("idin1").getValue();
			var catname = oevent.getParameter("value");
			//var catname = oevent.getSource().getValue();

			var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";

			//ProductSet
			var sapproductodatamodel = new ODataModel(sapdata);
			var sapproductjsonmodel = new JSONModel();
			var categoryfilter = new Filter("Category", FilterOperator.Contains, catname);

			sap.ui.core.BusyIndicator.show(0);

			sapproductodatamodel.read("/ProductSet", {
				filters: [categoryfilter],
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					//Table control
					sapproductjsonmodel.setSizeLimit(1000);
					sapproductjsonmodel.setData(req.results);
					this.getView().byId("sapproductstable").setModel(sapproductjsonmodel, "sapprod");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1002:" + msg);

				}

			}); // end of read

		}, //end of _searchcategory

		_rowselected: function(oevent) {

			var bc = oevent.getSource().getBindingContext("sapprod");
			var pid = bc.getProperty("ProductID");

			var cat = bc.getProperty("Category");
			var price = bc.getProperty("Price");

			if (oevent.getParameter("selected")) {
				MessageBox.success(pid + "########" + cat + "##########" + price);
			}

		}, //end of _rowselected

		_rowselectedUsingColumnListItem: function(oevent) {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.navTo("object", {
				from: "worklist",
				to: "object",
				ProductID : oevent.getSource().getBindingContext("sapprod").getProperty("ProductID")
			}, true);
		

		}, //end of _rowselectedUsingColumnListItem
		
		
		_openhellofrag : function(){
			
			if(!this.hello){
			this.hello = sap.ui.xmlfragment(this.getView().getId(),"zsapui5proj09fullscreen.fragments.HelloWorld",this);
			this.getView().addDependent(this.hello);
			}
			this.hello.open();
			
		},//end of _openhellofrag
		_hellook : function(){
			this.hello.close();
		},//end of _hellook
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		_onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._oTable = oTable;
			// keeps the search state
			this._oTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [new Filter("ProductID", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(oTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			this._oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("ProductID")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function(oTableSearchState) {
			var oViewModel = this.getModel("worklistView");
			this._oTable.getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (oTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});
});