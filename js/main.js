/***************************** 
 * This function loads a map
 * from arcgis
 *****************************/
function loadMap() {
    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",

        "esri/layers/FeatureLayer",
        "esri/renderers/Renderer",
        "esri/renderers/SimpleRenderer",
        "esri/widgets/Legend",
        "esri/widgets/Expand",
    ], function (esriConfig, Map, MapView, FeatureLayer,
        Renderer, SimpleRenderer, Legend, Expand) {
        esriConfig.apiKey = "AAPK568e9aaf89e34dab8650a3462a64c6cdgKxJ7W50yQdKWPfwHAQUVA30YyjpRu9NbB2GejXshNJH4no6nGoVVwbni9mK8EYH";

        // Feature layer to show counties in Idaho
        const counties = new FeatureLayer({
            url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties/FeatureServer/0",
            definitionExpression: "STATE_NAME = 'Idaho'"
        });

        // Label definition for the cows feature layer
        const labelClass = {
            // autocasts as new LabelClass()
            symbol: {
                type: "text", // autocasts as new TextSymbol()
                color: "white",
                font: {
                    // autocast as new Font()
                    family: "arial",
                    size: 8,
                    weight: "normal"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: "$feature.County" // What we want the label to display
            }
        };

        const cows = new FeatureLayer({
            // url: "https://services3.arcgis.com/DDZfXJ6Iyt4EVbZL/arcgis/rest/services/idaho_cows/FeatureServer/0",
            portalItem: {
                id: "a1b0092e610b4686a4dc666ef22b7ba8"
            },
            labelingInfo: [labelClass],
            popupEnabled: true
        });

        // The cow renderer. How to display the cow info
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
                    type: 'color', // Display population by color
                    field: 'population',
                    stops: [{
                            value: 852,
                            color: "#2b83ba"
                        },
                        {
                            value: 59926,
                            color: "#abdda4"
                        },
                        {
                            value: 119001,
                            color: "#ffffbf"
                        },
                    ]
                },
                {
                    type: 'size', // Display num_cattle by size
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

        // Popup template for cows
        const template = {
            title: "{county}",
            content: [{
                    type: "text",
                    text: "<b>County:</b> {county}<br><b>Number of cattle:</b> {num_cattle}<br><b>Population:</b> {population}"
                },
                {
                    type: "media",
                    mediaInfos: [{
                        type: "pie-chart",
                        value: {
                            fields: ["population", "num_cattle"],
                            tooltipField: "Cows to people"
                        },
                        caption: "Cows to people"
                    }]
                }
            ]
        }
        cows.popupTemplate = template;

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

        // The maps legend
        view.ui.add(new Expand({
            content: new Legend({
                view: view
            }),
            view: view,
            expanded: false
        }), "top-right");
    });
}

// Load the map
loadMap();