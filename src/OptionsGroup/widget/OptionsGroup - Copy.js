define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "OptionsGroup/lib/jquery-1.11.2",

], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    return declare("OptionsGroup.widget.OptionsGroup", [ _WidgetBase ], {

       //Modeler variables
        elementSelector: null,
        grpObject: null,
        defaultGroup: null,
        groupBasedOnDisplayText: null,


        // Internal variables.
        _handles: null,
        _contextObj: null,
        _dropdown: null,
        _selectedValue: null,

        _interval_f: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._interval_f = setInterval(lang.hitch(this, this._checkIfDropDownHasOptions), 10);
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");      

            this._contextObj = obj;

           //setTimeout(lang.hitch(this, this._processDropdown), 75);
            			
            this._updateRendering(callback);
        },

        _checkIfDropDownHasOptions: function() {
            logger.debug(this.id + "._checkIfDropDownHasOptions");
            
            if($("." + this.elementSelector + " select > option").length > 0) {
                clearInterval(this._interval_f);
                this._processDropdown();
            } else {
                console.log(this.elementSelector + "drop down dont have data yet.");
            }
        },

        _processDropdown: function() {
            logger.debug(this.id + "._processDropdown");  

            this._selectedValue = $("." + this.elementSelector + " select").val();

            var groupCategories = {};
            for(var key in this.grpObject) {
                groupCategories[this.grpObject[key].optionValue] = this.grpObject[key].groupName;
            }
		
            this._dropdown = $("." + this.elementSelector + " select");

            var groupOptions = {};
            var blankOption = null;
            var defGrp = this.defaultGroup;
            var useOptionText = this.groupBasedOnDisplayText;

            $("." + this.elementSelector + " select > option").each(function() {

                var key = $(this).val();
                var value =  $(this).text();

                if(key === '') {
                    blankOption = $(this);                    
                    return true;
                }

                var keyToUse = key;
                if(useOptionText) {
                    keyToUse = value;
                }

                var optGrpName = groupCategories[keyToUse];
                if(optGrpName == null) {
                    optGrpName = defGrp;
                }

                if(optGrpName in groupOptions == false) {
                    groupOptions[optGrpName] = {};
                }

                groupOptions[optGrpName][keyToUse] = $(this);
                
            });

            var html = '';
            if(blankOption) {
                html += blankOption.context.outerHTML;
            }

            for(var j in groupOptions) {
                html += '<optGroup label="' + j + '">';
                for(var i in groupOptions[j]) {
                    html += groupOptions[j][i].context.outerHTML;
                }
                html += '</optGroup>';
            }

            this._dropdown.html(html);
            this._dropdown.val(this._selectedValue);
        },

        _alert: function() {
            alert("hello again");
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");            
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }            

            this._executeCallback(callback, "_updateRendering");       
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["OptionsGroup/widget/OptionsGroup"]);
