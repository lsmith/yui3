YUI.add("datasource-arrayschema",function(b){var a=function(){a.superclass.constructor.apply(this,arguments);};b.mix(a,{NS:"schema",NAME:"dataSourceArraySchema",ATTRS:{schema:{}}});b.extend(a,b.Plugin.Base,{initializer:function(c){this.doBefore("_defDataFn",this._beforeDefDataFn);},_beforeDefDataFn:function(f){var c=(b.DataSource.IO&&(this.get("host") instanceof b.DataSource.IO)&&b.Lang.isString(f.data.responseText))?f.data.responseText:f.data,d=f.details[0];d.response=b.DataSchema.Array.apply.call(this,this.get("schema"),c)||{meta:{},results:c};b.mix(d.response.meta,f.meta);this.get("host").fire("response",d);return new b.Do.Halt("DataSourceArraySchema plugin halted _defDataFn");}});b.namespace("Plugin").DataSourceArraySchema=a;},"@VERSION@",{requires:["datasource-local","plugin","dataschema-array"]});