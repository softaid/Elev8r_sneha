/**
 * CKEditor wrapped in a UI5 control
 * @version v1.0.0 - 2014-06-07
 * @link http://jasper07.github.io/openui5-ckeditor/
 * @author John Patterson <john.patterson@secondphase.com.au>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
//Define location of CKEditor js file
jQuery.sap.registerResourcePath('ckeditor', '//cdnjs.cloudflare.com/ajax/libs/ckeditor/4.3.2/ckeditor');
window.CKEDITOR_BASEPATH = '//cdnjs.cloudflare.com/ajax/libs/ckeditor/4.3.2/';
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'openui5/CKEditorToolbar', 'ckeditor'],
    function(jQuery, Control, CKEditorToolbar, Editor) {
        'use strict';

        Editor = window.CKEDITOR;

        var CKEditor = Control.extend('openui5.CKEditor', {
            metadata: {
                properties: {
                    'value': {
                        type: 'string',
                        group: 'Data',
                        bindable: 'bindable',
                        defaultValue: ''
                    },
                    'width': {
                        type: 'sap.ui.core.CSSSize',
                        group: 'Dimension',
                        defaultValue: '100%'
                    },
                    'height': {
                        type: 'sap.ui.core.CSSSize',
                        group: 'Dimension',
                        defaultValue: '200px'
                    },
                    'toolbar': {
                        type: 'string',
                        defaultValue: 'Full'
                    },
                    'inline': {
                        type: 'boolean',
                        group: 'Misc',
                        defaultValue: false
                    },
                    'editable': {
                        type: 'boolean',
                        group: 'Misc',
                        defaultValue: true
                    },
                    'required': {
                        type: 'boolean',
                        group: 'Misc',
                        defaultValue: false
                    },
                    'uiColor': {
                        type: 'string',
                        defaultValue: '#FAFAFA'
                    }
                },
                events: {
                    'change': {},
                    'ready': {}
                }
            },
            renderer: function(oRm, oControl) {
                oRm.write('<textarea ');
                oRm.writeAttribute('id', oControl.getId() + '-textarea');
                oRm.write('>');
                oRm.write(oControl.getValue());
                oRm.write('</textarea>');
            }
        });

        CKEditor.prototype.init = function() {
            this.textAreaId = this.getId() + '-textarea';
        };

        CKEditor.prototype.setValue = function(sValue) {
            this.setProperty('value', sValue, true);
            if (this.editor && sValue !== this.editor.getData()) {
                this.editor.setData(sValue);
            }
        };

        CKEditor.prototype.getText = function() {
            return this.editor.document.getBody().getText();
        };

        CKEditor.prototype.setInline = function(bInline) {
            this.setProperty('inline', bInline, true);
        };

        CKEditor.prototype.setEditable = function(bEditable) {
            this.setProperty('editable', bEditable, true);
            if (this.editor) {
                this.editor.setReadOnly(!bEditable);
            }

        };

        CKEditor.prototype.onAfterRendering = function() {
            if (!this._bEditorCreated) {
                // first rendering: instantiate the editor
                this.afterFirstRender();
            } else {
                // subsequent re-rendering: 
                this.editor = Editor.instances[this.textAreaId];
                var value;
                if (this.editor && (value = this.getValue())) {
                    this.editor.setData(value);
                }
            }

        };
        CKEditor.prototype._getOptions = function() {
            var options = {};
            options.toolbar = CKEditorToolbar[this.getToolbar()];
            options.disableNativeSpellChecker = false;
            options.uiColor = this.getUiColor();
            options.height = this.getHeight();
            options.width = this.getWidth();
            options.toolbarStartupExpanded = true;
            options.removePlugins = 'scayt,contextmenu,tabletools,liststyle';
            options.browserContextMenuOnCtrl = true;
            return options;
        };

        CKEditor.prototype.afterFirstRender = function() {
            Editor.disableAutoInline = true;
            if (this.getInline()) {
                this.editor = Editor.inline(this.textAreaId, this._getOptions());
            } else {
                this.editor = Editor.replace(this.textAreaId, this._getOptions());
            }

            this.editor.on('change', jQuery.proxy(this.onEditorChange, this));
            this.editor.on('blur', jQuery.proxy(this.onEditorChange, this));
            this.editor.on('mode', jQuery.proxy(this.onModeChange, this));
            this.editor.on('instanceReady', jQuery.proxy(this.onInstanceReady, this));

            this._bEditorCreated = true;
        };

        CKEditor.prototype.onEditorChange = function() {
            //on editor change update control value
            var oldVal = this.getValue(),
                newVal = this.editor.getData();

            if (oldVal !== newVal) {
                this.setProperty('value', newVal, true); // suppress rerendering
                this.fireChange({
                    oldValue: oldVal,
                    newValue: newVal
                });
            }

        };

        CKEditor.prototype.onModeChange = function() {
            // update value after source has changed
            if (this.evtSource === true && this.editor.getCommand('source').state === Editor.TRISTATE_OFF) {
                this.onEditorChange();
            }

            if (this.editor.mode === 'source') {
                this.evtSource = true;
            } else {
                this.evtSource = false;
            }
        };

        CKEditor.prototype.onInstanceReady = function() {
            // overwrite gradient with solid background
            jQuery.sap.byId(this.editor.id + '_top').css('background', this.editor.getUiColor());
            jQuery.sap.byId(this.editor.id + '_bottom').css('background', this.editor.getUiColor());
        };

        CKEditor.prototype.exit = function() {
            this.editor.destroy();
        };

        return CKEditor;
    }, true);