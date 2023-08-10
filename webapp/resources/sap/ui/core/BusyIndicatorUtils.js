/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BlockLayerUtils","sap/ui/core/library"],function(a,i){"use strict";var e=function(){};var c=i.BusyIndicatorSize;e.getElement=function(i){var e;switch(i){case c.Large:e="sapUiLocalBusyIndicatorSizeBig sapUiLocalBusyIndicatorShowContainer";break;case c.Medium:e="sapUiLocalBusyIndicatorSizeMedium";break;case c.Section:e="sapUiLocalBusyIndicatorSizeSection sapUiLocalBusyIndicatorShowContainer";break;default:e="sapUiLocalBusyIndicatorSizeMedium";break}var n=document.createElement("div");n.className="sapUiLocalBusyIndicator "+e+" sapUiLocalBusyIndicatorFade";a.addAriaAttributes(n);t(n);return n};function t(a,i){i=i||"sapUiLocalBusyIndicatorAnimStandard";var e=document.createElement("div");e.className="sapUiLocalBusyIndicatorAnimation "+i;e.appendChild(document.createElement("div"));e.appendChild(document.createElement("div"));e.appendChild(document.createElement("div"));a.appendChild(e)}function n(a,i){var e=a.$parent.get(0),c=a.$blockLayer.get(0);var t=c.children[0],n=t.offsetWidth;if(e.offsetWidth<n){t.className="sapUiLocalBusyIndicatorAnimation sapUiLocalBusyIndicatorAnimSmall"}}e.addHTML=function(a,i){var e,o;switch(i){case c.Small:e="sapUiLocalBusyIndicatorSizeMedium";o="sapUiLocalBusyIndicatorAnimSmall";break;case c.Section:e="sapUiLocalBusyIndicatorSizeSection sapUiLocalBusyIndicatorShowContainer";o="sapUiLocalBusyIndicatorAnimStandard ";break;case c.Large:e="sapUiLocalBusyIndicatorSizeBig sapUiLocalBusyIndicatorShowContainer";o="sapUiLocalBusyIndicatorAnimStandard";break;case c.Auto:e="sapUiLocalBusyIndicatorSizeMedium";o="sapUiLocalBusyIndicatorAnimStandard";break;default:e="sapUiLocalBusyIndicatorSizeMedium";o="sapUiLocalBusyIndicatorAnimStandard";break}if(!a){return}var s=a.$parent.get(0),r=a.$blockLayer.get(0);s.className+=" sapUiLocalBusy";r.className+=" sapUiLocalBusyIndicator "+e+" sapUiLocalBusyIndicatorFade";t(r,o);if(i===c.Auto){n(a)}};return e},true);