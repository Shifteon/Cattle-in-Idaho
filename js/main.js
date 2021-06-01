function loadMap() {
    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",

        "esri/layers/FeatureLayer",
        "esri/widgets/Editor",
        "esri/renderers/Renderer",
        "esri/renderers/SimpleRenderer",
        "esri/smartMapping/renderers/color",
        "esri/smartMapping/renderers/size",
        "esri/renderers/ClassBreaksRenderer",
        "esri/renderers/visualVariables/SizeVariable",
        "esri/renderers/visualVariables/ColorVariable",
        "esri/widgets/Legend",
        "esri/widgets/Expand"
    ], function (esriConfig, Map, MapView, FeatureLayer, Editor,
        Renderer, SimpleRenderer, colorRendererCreator, sizeRendererCreator,
        ClassBreaksRenderer, SizeVariable, ColorVariable, Legend, Expand) {
        esriConfig.apiKey = "AAPK2b642b3b897a44e2817fe368b10e8ff8QMEisrPKE9bVSL5P8J6Ybd_lwpF5jslGgs5LS63gAiR2Hz0w7hoJRqTrN_CMv_Gc";

        // Feature layer to show counties in Idaho
        const counties = new FeatureLayer({
            url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties/FeatureServer/0",
            definitionExpression: "STATE_NAME = 'Idaho'"
        });

        // const colorParams = {
        //     layer: cows,
        //     view: view,
        //     field: "population",
        //     theme: "high-to-low"
        // }

        // const sizeParams = {
        //     layer: cows,
        //     view: view,
        //     field: "num_cattle",
        //     theme: "high-to-low"
        // };


        const referenceScale = 2;
        const cowRenderer = {
            type: "simple",
            visualVariables: [{
                    type: 'color',
                    field: 'population'
                },
                {
                    type: 'size',
                    field: 'num_cattle',
                    minDataValue: 260,
                    maxDataValue: 318333,
                    minSize: 4,
                    maxSize: 22
                }
            ]
        };

        const cows = new FeatureLayer({
            url: "https://services3.arcgis.com/DDZfXJ6Iyt4EVbZL/arcgis/rest/services/cows/FeatureServer/0",
            // renderer: cowRenderer
        });

        cows.renderer = {
            type: "simple",
            symbol: {
                type: "simple-marker",
                style: "circle",
                color: [50, 50, 50, 0.4],
                outline: {
                    color: [255, 255, 255, 0.3],
                    width: 0.2
                },
                size: "20px"
            },
            visualVariables: [{
                    type: 'color',
                    field: 'population',
                    stops: [
                        { value: 852, color: "#2b83ba" },
                        { value: 59926, color: "#abdda4" },
                        { value: 119001, color: "#ffffbf" },
                      ]
                },
                {
                    type: 'size',
                    field: 'num_cattle',
                    minDataValue: 260,
                    maxDataValue: 318333,
                    minSize: 6,
                    maxSize: 83
                }
            ]
        };

        // Change the styles of the county lines
        counties.renderer = {
            type: "simple",
            symbol: {
                // A nice blue
                color: [76, 100, 201, 255],
                outline: {
                    color: [76, 100, 201, 255],
                    width: 0.75,
                    type: "esriSLS",
                    style: "Solid"
                },
                type: "simple-line",
                style: "solid"
            }
        }

        // cows.renderer = {
        //     type: "unique-value",

        // }

        // map.add(counties);

        // Setting up the map we display
        const map = new Map({
            basemap: "dark-gray",
            layers: [counties, cows]
        });

        // Our view. Set things like where to put the map, what the map is, the zoom level
        // and where to center the map
        const view = new MapView({
            container: "viewDiv",
            map: map,
            zoom: 7,
            center: [-113.97301293981857, 43.73172061673778]
        });

        view.ui.add(new Expand({
            content: new Legend({
                view: view
            }),
            view: view,
            expanded: false
        }), "top-right");



        // colorRendererCreator.createClassBreaksRenderer(colorParams)
        //     .then(function (response) {
        //         cows.renderer = response.renderer;
        //     });

        // sizeRendererCreator.createClassBreaksRenderer(sizeParams)
        //     .then(function (response) {
        //         cows.renderer = response.renderer;
        //     });

        // Editor widget
        // const editor = new Editor({
        //     view: view
        // });
        // // Add widget to the view
        // view.ui.add(editor, "top-right");
    });
}

loadMap();