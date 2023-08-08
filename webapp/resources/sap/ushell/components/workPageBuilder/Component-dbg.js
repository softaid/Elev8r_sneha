//Copyright (c) 2009-2022 SAP SE, All Rights Reserved
/**
 * @fileOverview WorkPageBuilder Component
 * This UIComponent gets initialized by the FLP renderer upon visiting
 * #Launchpad-openWorkPage if work pages are enabled (/core/workPages/enabled).
 *
 * @version 1.109.2
 */

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    /**
     * Component of the WorkPagesRuntime view.
     *
     * @param {string} sId Component id
     * @param {object} oSParams Component parameter
     *
     * @class
     * @extends sap.ui.core.UIComponent
     *
     * @private
     * @since 1.99.0
     * @alias sap.ushell.components.workPageBuilder.Component
     */
    return UIComponent.extend("sap.ushell.components.workPageBuilder.Component", /** @lends sap.ushell.components.workPageBuilder.Component */{
        metadata: {
            manifest: "json",
            library: "sap.ushell",
            properties: {
                /**
                 * Defines the root path for the WorkPage in the model.
                 * Can be set by an external entity.
                 */
                modelRootPath: {
                    type: "string",
                    multiple: false,
                    defaultValue: "/data"
                }
            },
            events: {
                loadCatalog: {},
                workPageEdited: {
                    parameters: {
                        /**
                         * Indicates if the WorkPage has changes or not
                         */
                        hasChanges: {type: "boolean"}
                    }
                },
                changeContentFinderState: {
                    parameters: {
                        /**
                         * Indicates if the Content Finder is open or not
                         */
                        isOpen: {type: "boolean"}
                    }
                },
                closeEditMode: {
                    parameters: {
                        /**
                         * Indicates if the changes have to be saved
                         */
                        saveChanges: {type: "boolean"}
                    }
                }
            }
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
        },

        /**
         * API to call the getEditMode function on the WorkPageBuilder controller.
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
        */
        getEditMode: function () {
            this.getRootControl().getController().getEditMode();
        },

        /**
         * API to call the setEditMode function on the WorkPageBuilder controller.
         * @param {boolean} bEditMode true or false
         *
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
        */
        setEditMode: function (bEditMode) {
            this.getRootControl().getController().setEditMode(bEditMode);
        },

        /**
         * API to call the getPageData function on the WorkPageBuilder controller.
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
        */
        getPageData: function () {
            this.getRootControl().getController().getPageData();
        },

        /**
         * API to call the setPageData function on the WorkPageBuilder controller.
         * @param {object} oPageData WorkPage data object
         *
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
        */
        setPageData: function (oPageData) {
            this.getRootControl().getController().setPageData(oPageData);
        },

        /**
         * API to call the setCatalogData function on the WorkPageRuntime controller.
         * @param {object[]} aCatalogData Array of Visualizations
         *
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
        */
        setCatalogData: function (aCatalogData) {
            this.getRootControl().getController().setCatalogData(aCatalogData);
        }
    });
});
