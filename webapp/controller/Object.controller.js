/*global location*/
sap.ui.define([
		"zsapui5proj09fullscreen/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"zsapui5proj09fullscreen/model/formatter",
		"sap/ui/model/odata/ODataModel",
		"sap/m/MessageToast",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter,ODataModel,MessageToast,Filter,FilterOperator
	) {
		"use strict";

		return BaseController.extend("zsapui5proj09fullscreen.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

		onInit : function(){
			debugger;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.getTheSelectedProductIDfromWorklist,this);
		}  ,//end of onInit      
		getTheSelectedProductIDfromWorklist : function(oevent){
			debugger;
			//oevent.mParameters.arguments.ProductID;
			var pid = oevent.getParameter("arguments").ProductID;
			
	var sapdata = "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";
			
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
					sapproductjsonmodel.setData(req.results[0]);
					this.getView().setModel(sapproductjsonmodel);

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed/Retry:1002:" + msg);

				}

			}); // end of read
		},//end of getTheSelectedProductIDfromWorklist





		_toworklist : function(){
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.navTo("worklist", {}, true);	
			
		},//end of _toworklist

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			_onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						// Restore original busy indicator delay for the object view
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("objectView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},


			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ProductSet", {
						ProductID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								// Busy indicator on view should only be set if metadata is loaded,
								// otherwise there may be two busy indications next to each other on the
								// screen. This happens because route matched handler already calls '_bindView'
								// while metadata is loaded.
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.ProductID,
					sObjectName = oObject.ProductID;

				// Everything went fine.
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			}

		});

	}
);