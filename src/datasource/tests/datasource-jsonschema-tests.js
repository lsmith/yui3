YUI.add('datasource-jsonschema-tests', function(Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite("Plugin.DataSourceJSONSchema Test Suite"),

    jsonData = '{"ResultSet":{"Result":[{"Title":"1"},{"Title":"2"},{"Title":"3"},{"Title":"4"},{"Title":"5"},{"Title":"6"},{"Title":"7"},{"Title":"8"},{"Title":"9"},{"Title":"10"}]}}';


suite.add(new Y.Test.Case({
    name: "DataSource JSONSchema Plugin Tests",

    testJSONSchema: function() {
        var ds = new Y.DataSource.Local({ source: jsonData }),
            request = null, response;

        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "ResultSet.Result",
                resultFields: ["Title"]
            }
        });

        ds.sendRequest({
            callback: {
                success: function (e) {
                    request  = e.request;
                    response = e.response;
                }
            }
        });

        Assert.isUndefined(request, "Expected undefined request.");
        Assert.isObject(response, "Expected normalized response object.");
        Assert.isArray(response.results, "Expected results array.");
        Assert.areSame(10, response.results.length, "Expected 10 results.");
        Assert.isNotUndefined(response.results[0].Title, "Expected Title property");
    },

    testSchemaError: function() {
        var ds = new Y.DataSource.Local({ source: jsonData }),
            request = null, response, error;

        ds.plug(Y.Plugin.DataSourceJSONSchema);

        ds.sendRequest({
            callback: {
                failure: function (e) {
                    response = e.response;
                    error    = e.error;
                }
            }
        });

        Assert.isObject(response, "Expected normalized response object.");
        Assert.isObject(error, "Expected response error.");
    },

    testJSONSchemaMeta: function() {
        var data = {
                produce: {
                    fruit: [
                        { name: 'Banana', color: 'yellow', price: '1.96' },
                        { name: 'Orange', color: 'orange', price: '2.04' },
                        { name: 'Eggplant', color: 'purple', price: '4.31' }
                    ]
                },
                lastInventory: '2011-07-19'
            },
            ds = new Y.DataSource.Local({ source: data }),
            request = null, response;

        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "produce.fruit",
                resultFields: [ 'name', 'color' ],
                metaFields: [ 'lastInventory' ]
            }
        });

        ds.sendRequest({
            callback: {
                success: function (e) {
                    request  = e.request;
                    response = e.response;
                }
            }
        });

        Assert.isUndefined(request, "Expected undefined request.");
        Assert.isObject(response, "Expected normalized response object.");
        Assert.isArray(response.results, "Expected results array.");
        Assert.areSame(3, response.results.length, "Expected 3 results.");
        Assert.isNotUndefined(response.results[0].name, "Expected name property");
        Assert.areSame(data.lastInventory, response.meta.lastInventory, "Expected meta property");
    },

    testJSONSchemaMeta2: function() {
        var data = {
                produce: {
                    fruit: [
                        { name: 'Banana', color: 'yellow', price: '1.96' },
                        { name: 'Orange', color: 'orange', price: '2.04' },
                        { name: 'Eggplant', color: 'purple', price: '4.31' }
                    ]
                },
                lastInventory: '2011-07-19'
            },
            ds = new Y.DataSource.Function({ source: function() {
                return {
                    data: data,
                    meta: {
                        foo: 'bar'
                    }
                };
            }}),
            request = null, response;

        ds.plug(Y.Plugin.DataSourceJSONSchema, {
            schema: {
                resultListLocator: "produce.fruit",
                resultFields: [ 'name', 'color' ],
                metaFields: [ 'lastInventory' ]
            }
        });

        ds.sendRequest({
            callback: {
                success: function (e) {
                    request  = e.request;
                    response = e.response;
                }
            }
        });

        Assert.isUndefined(request, "Expected undefined request.");
        Assert.isObject(response, "Expected normalized response object.");
        Assert.isArray(response.results, "Expected results array.");
        Assert.areSame(3, response.results.length, "Expected 3 results.");
        Assert.isNotUndefined(response.results[0].name, "Expected name property");
        Assert.areSame(data.lastInventory, response.meta.lastInventory, "Expected meta property lastInventory");
        Assert.areSame('bar', response.meta.foo, "Expected meta property foo");
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datasource-jsonschema', 'test', 'datasource-function']});
