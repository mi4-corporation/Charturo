/*
 *  Charturo Interactive Line Chart
 *
 *  Copyright (c) Mi4 Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/* Scale buttons code from https://bl.ocks.org/benjchristensen/2657838 */
/* Simple d3.js Line Chart PBI VIZ https://github.com/dm-p/powerbi-visuals-example-simple-line-chart */

"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import IColorPalette = powerbi.extensibility.IColorPalette;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import ISelectionId = powerbi.visuals.ISelectionId;
import Fill = powerbi.Fill;
import IColorInfo = powerbi.IColorInfo;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import { VisualSettings } from "./settings";
import * as d3 from "d3";
import { select as d3Select } from "d3-selection";
import * as d3Legend from "d3-svg-legend";

/** Add tooltips */
// import tooltip = powerbi.extensibility.ITooltipService;

import {
    createTooltipServiceWrapper,
    TooltipEventArgs,
    ITooltipServiceWrapper,
    TooltipEnabledDataPoint,
} from "powerbi-visuals-utils-tooltiputils";
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;

import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: '0000-0000-0000-0000' // Add your app insights instrumentation key here

        // Other configuration option
        // connectionString: '0000-0000-0000-0000'      
    }
});

appInsights.loadAppInsights();

interface ViewModel {
    dataSets: Array<DataPoint[]>;
}

interface DataPoint {
    xValue: any;
    yValue: number;
    measure: string;
    legend: any;
    color: string;
    identity: powerbi.visuals.ISelectionId;
    category: string;
}

/** This specifices the 'shape' of the data in each row. */

function visualTransform(options: VisualUpdateOptions, host: IVisualHost) {
    /** TODO: Refactor code into this function */
}

export class Visual implements IVisual {
    private host: IVisualHost;
    private target: HTMLElement;
    private settings: VisualSettings;
    private container: d3.Selection<HTMLDivElement, any, HTMLDivElement, any>;
    private myOptions: VisualUpdateOptions;
    private dataViews;
    private viewModel: ViewModel = { dataSets: [] };
    private legendArray: string[] = [];
    private queryNames: {} = {};
    private serieColors: string[] = [];
    private selectionManager: ISelectionManager;
    private colors = [
        "#a9a9a9",
        "#66ccff",
        "#00008B",
        "red",
        "#B22222",
        "steelblue",
        "orange",
        "yellow",
        "AliceBlue",
        "AntiqueWhite",
        "Aqua",
        "Aquamarine",
        "Azure",
        "Beige",
        "Bisque",
        "Black",
        "BlanchedAlmond",
        "Blue",
        "BlueViolet",
        "Brown",
        "BurlyWood",
        "CadetBlue",
        "Chartreuse",
        "Chocolate",
        "Coral",
        "CornflowerBlue",
        "Cornsilk",
        "Crimson",
        "Cyan",
        "DarkBlue",
        "DarkCyan",
        "DarkGoldenRod",
        "DarkGray",
        "DarkGrey",
        "DarkKhaki",
        "DarkMagenta",
        "DarkOliveGreen",
        "DarkOrange",
        "DarkOrchid",
        "DarkRed",
        "DarkSalmon",
        "DarkSeaGreen",
        "DarkSlateBlue",
        "DarkSlateGray",
        "DarkSlateGrey",
        "DarkTurquoise",
        "DarkViolet",
        "DeepPink",
        "DeepSkyBlue",
        "DimGray",
        "DimGrey",
        "DodgerBlue",
        "FireBrick",
        "FloralWhite",
        "ForestGreen",
        "Fuchsia",
        "Gainsboro",
        "GhostWhite",
        "Gold",
        "GoldenRod",
        "Gray",
        "Grey",
        "Green",
        "GreenYellow",
        "HoneyDew",
        "HotPink",
        "IndianRed",
        "Indigo",
        "Ivory",
        "Khaki",
        "Lavender",
        "LavenderBlush",
        "LawnGreen",
        "LemonChiffon",
        "LightBlue",
        "LightCoral",
        "LightCyan",
        "LightGoldenRodYellow",
        "LightGray",
        "LightGrey",
        "LightGreen",
        "LightPink",
        "LightSalmon",
        "LightSeaGreen",
        "LightSkyBlue",
        "LightSlateGray",
        "LightSlateGrey",
        "LightSteelBlue",
        "LightYellow",
        "Lime",
        "LimeGreen",
        "Linen",
        "Magenta",
        "MediumAquaMarine",
        "MediumBlue",
        "MediumOrchid",
        "MediumPurple",
        "MediumSeaGreen",
        "MediumSlateBlue",
        "MediumSpringGreen",
        "MediumTurquoise",
        "MediumVioletRed",
        "MidnightBlue",
        "MintCream",
        "MistyRose",
        "Moccasin",
        "NavajoWhite",
        "Navy",
        "OldLace",
        "Olive",
        "OliveDrab",
        "Orange",
        "OrangeRed",
        "Orchid",
        "PaleGoldenRod",
        "PaleGreen",
        "PaleTurquoise",
        "PaleVioletRed",
        "PapayaWhip",
        "PeachPuff",
        "Peru",
        "Pink",
        "Plum",
        "PowderBlue",
        "Purple",
        "RebeccaPurple",
        "Red",
        "RosyBrown",
        "RoyalBlue",
        "SaddleBrown",
        "Salmon",
        "SandyBrown",
        "SeaGreen",
        "SeaShell",
        "Sienna",
        "Silver",
        "SkyBlue",
        "SlateBlue",
        "SlateGray",
        "SlateGrey",
        "Snow",
        "SpringGreen",
        "SteelBlue",
        "Tan",
        "Teal",
        "Thistle",
        "Tomato",
        "Turquoise",
        "Violet",
        "Wheat",
        "White",
        "WhiteSmoke",
        "Yellow",
        "YellowGreen",
    ];

    // Tooltip service
    private tooltipServiceWrapper: ITooltipServiceWrapper;

    private scales = [
        ["linear", "Linear"],
        // ["pow", "Power"],
        ["log", "Log"],
    ];
    private yScale = "linear"; // can be pow, log, linear

    constructor(options: VisualConstructorOptions) {
        console.log("Visual constructor", options);
        var element = (this.target = options.element);
        this.host = options.host;
        this.selectionManager = this.host.createSelectionManager();

        /** Add for tooltips */
        this.tooltipServiceWrapper = createTooltipServiceWrapper(
            options.host.tooltipService,
            options.element
        );

        appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview

        /** Create the chart container when the visual loads */
        this.container = d3
            .select(this.target)
            .append("div")
            .attr("id", "my_dataviz");
    }

    public enumerateObjectInstances(
        options: EnumerateVisualObjectInstancesOptions
    ): VisualObjectInstanceEnumeration {
        let objectName: string = options.objectName;
        let objectEnumeration: VisualObjectInstance[] = [];

        switch (objectName) {
            case "legend":
                objectEnumeration.push({
                    objectName,
                    properties: {
                        show: this.settings.legend.show,
                        position: this.settings.legend.position,
                        title: this.settings.legend.title,
                        legendName: this.settings.legend.legendName,
                        color: this.settings.legend.color,
                        fontFamily: this.settings.legend.fontFamily,
                        textSize: this.settings.legend.textSize,
                        style: this.settings.legend.style,
                    },
                    selector: null,
                });
                break;
            case "xAxis":
                objectEnumeration.push({
                    objectName,
                    properties: {
                        showXAxis: this.settings.xAxis.showXAxis,
                        showTitle: this.settings.xAxis.showTitle,
                        xAxisPosition: this.settings.xAxis.xAxisPosition,
                        textColor: this.settings.xAxis.textColor,
                        textSize: this.settings.xAxis.textSize,
                        gridLines: this.settings.xAxis.gridLines,
                    },
                    selector: null,
                });
                if (this.settings.xAxis.gridLines) {
                    objectEnumeration.push({
                        objectName,
                        properties: {
                            gridLineStyle: this.settings.xAxis.gridLineStyle,
                            gridLineColor: this.settings.xAxis.gridLineColor,
                        },
                        selector: null,
                    });
                }
                break;
            case "yAxis":
                objectEnumeration.push({
                    objectName,
                    properties: {
                        showTitle: this.settings.yAxis.showTitle,
                        showYAxis: this.settings.yAxis.showYAxis,
                        reverse: this.settings.yAxis.reverse,
                        units: this.settings.yAxis.units,
                        min: this.settings.yAxis.min,
                        max: this.settings.yAxis.max,
                        y1AxisColor: this.settings.yAxis.y1AxisColor,
                        gridLines: this.settings.yAxis.gridLines,
                    },
                    selector: null,
                });
                if (this.settings.yAxis.gridLines) {
                    objectEnumeration.push({
                        objectName,
                        properties: {
                            gridLineStyle: this.settings.yAxis.gridLineStyle,
                            gridLineColor: this.settings.yAxis.gridLineColor,
                        },
                        selector: null,
                    });
                }
                break;
            case "y2Axis":
                objectEnumeration.push({
                    objectName,
                    properties: {
                        showTitle: this.settings.y2Axis.showTitle,
                        showYAxis: this.settings.y2Axis.showYAxis,
                        reverse: this.settings.y2Axis.reverse,
                        units: this.settings.y2Axis.units,
                        min: this.settings.y2Axis.min,
                        max: this.settings.y2Axis.max,
                        y2AxisColor: this.settings.y2Axis.y2AxisColor,
                    },
                    selector: null,
                });
                break;
            case "tooltip":
                objectEnumeration.push({
                    objectName,
                    properties: {
                        show: this.settings.tooltip.show,
                    },
                    selector: null,
                });
                break;
            case "scale":
                objectEnumeration.push({
                    objectName,
                    properties: {
                        controlMode: this.settings.scale.controlMode,
                    },
                    selector: null,
                });
                if (this.settings.scale.controlMode == "designer") {
                    objectEnumeration.push({
                        objectName,
                        properties: {
                            designerScaleType: this.settings.scale.designerScaleType,
                        },
                        selector: null,
                    });
                    if (this.settings.scale.designerScaleType == "power") {
                        objectEnumeration.push({
                            objectName,
                            properties: {
                                powerValue: this.settings.scale.powerValue
                            },
                            selector: null
                        })
                    }
                } else {
                    objectEnumeration.push({
                        objectName,
                        properties: {
                            type: this.settings.scale.type,
                        },
                        selector: null,
                    });
                }
                break;
            case "colorSelector":
                if (this.viewModel) {
                    for (let i = 0; i < this.legendArray.length; i++)
                        objectEnumeration.push({
                            objectName: this.viewModel.dataSets[i][0].legend,
                            displayName: this.viewModel.dataSets[i][0].legend,
                            properties: {
                                displayName: this.legendArray[i],
                                fill: this.serieColors[i],
                            },
                            selector: this.viewModel.dataSets[i][0].identity.getSelector(),
                        });
                }
                break;
        }
        return objectEnumeration;
    }

    public update(options: VisualUpdateOptions) {
        console.log("-------------------Visual update", options);
        this.myOptions = options;
        this.settings = Visual.parseSettings(
            options && options.dataViews && options.dataViews[0]
        );

        /** Clear down existing plot */
        this.container.selectAll("*").remove();

        /** Test 1: Data view has both fields added */
        this.dataViews = options.dataViews;
        let dataViews = this.dataViews;
        console.log("Test 1: Valid data view...");
        if (
            !dataViews ||
            !dataViews[0] ||
            !dataViews[0].categorical ||
            !dataViews[0].categorical.categories ||
            !dataViews[0].categorical.categories[0].source ||
            !dataViews[0].categorical.values
        ) {
            console.log("Test 1 FAILED. No data to draw table.");
            return true;
        }

        /** If we get this far, we can trust that we can work with the data! */
        var categorical = dataViews[0].categorical;
        var categories = dataViews[0].categorical.categories;
        var isValueDatetime = categories[0].source.type.dateTime;
        var isValueText = categories[0].source.type.text;
        var isValueNumeric = categories[0].source.type.numeric;
        var values = dataViews[0].categorical.values;
        console.log("dataPoints", categories[0].values.length)

        this.viewModel.dataSets = this.fetchData(dataViews);
        let dataSets = this.viewModel.dataSets;

        let measure1Datasets: Array<DataPoint[]> = [];
        let measure2Datasets: Array<DataPoint[]> = [];

        var firstMeasure = false;
        var y1AxisTitle = [];
        var secondMeasure = false;
        var y2AxisTitle = [];

        dataViews[0].metadata.columns.forEach((measure) => {
            if (!!measure.roles.measure1) {
                firstMeasure = true;
                y1AxisTitle.push(measure.displayName);
            }

            if (!!measure.roles.measure2) {
                secondMeasure = true;
                y2AxisTitle.push(measure.displayName);
            }
        });

        dataSets.forEach((dataSet) => {
            if (secondMeasure && dataSet[0].measure == "measure2") {
                measure2Datasets.push(dataSet);
            } else {
                measure1Datasets.push(dataSet);
            }
        });

        let measure1Data = [];
        let measure2Data = [];

        measure1Datasets.forEach((dataSet) => measure1Data.push(...dataSet));
        measure2Datasets.forEach((dataSet) => measure2Data.push(...dataSet));

        console.log(dataSets)

        /** Parse our mapped data and view the output */

        /** Set the dimensions and margins of the graph */
        var margin = { top: 20, right: 60, bottom: 30, left: 60 },
            width = options.viewport.width - margin.left - margin.right,
            height = options.viewport.height - margin.top - margin.bottom;

        /** Append the svg object to the body of the page */
        var svg = this.container
            .append("svg")
            .attr("id", "main")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("id", "main-chart")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg
            .append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("id", "abc")
            .attr("width", width)
            .attr("height", height);

        /** Add X axis --> it is a date format */
        var xAxisTextColor = this.settings.xAxis.textColor;
        var showXAxis = this.settings.xAxis.showXAxis;
        var xAxisTitle = categories[0].source.displayName;
        var showXTitle = this.settings.xAxis.showTitle;

        //x data and scale
        var x;
        var xGrid: boolean = this.settings.xAxis.gridLines;
        var xGridLineStyle: string = this.settings.xAxis.gridLineStyle;
        var y1GridLineStyle: string = this.settings.yAxis.gridLineStyle;
        var xAxisPosition = this.settings.xAxis.xAxisPosition;
        var xAxisHeight: number = xAxisPosition == "bottom" ? height - 7 : -7;

        var xGridTickSize: number = 0;
        if (xGrid) {
            xGridTickSize = xAxisHeight;
        }

        // x axis attributes
        var xAxis = svg
            .append("g")
            .attr("id", "xAxis")
            .attr("transform", "translate(0," + xAxisHeight + ")")
            // Add the ablity to change the color of text
            .attr("stroke", xAxisTextColor)
            .attr("stroke-width", 0.5);

        /** Grid lines */
        var xAxisGrid = svg
            .append("g")
            .attr("id", "xAxisGrid")
            .attr("class", xGridLineStyle)
            .attr("transform", "translate(0," + xAxisHeight + ")");
        var yAxisGrid = svg
            .append("g")
            .attr("id", "y1AxisGrid")
            .attr("class", y1GridLineStyle);

        /** X Axis format */
        if (isValueDatetime) {
            x = d3
                .scaleTime()
                .domain(d3.extent(dataSets[0], (d) => d.xValue))
                .range([0, width]);

            if (showXAxis) {
                if (xAxisPosition == "bottom") {
                    d3.select("g #xAxis").call(d3.axisBottom(x).ticks(width >= 400 ? 12 : 4));
                }
                if (xAxisPosition == "top") {
                    d3.select("g #xAxis").call(d3.axisTop(x).ticks(width >= 400 ? 12 : 4));
                }

                d3.select("g #xAxisGrid").call(
                    d3
                        .axisBottom(x)
                        .tickFormat((d) => "")
                        .tickSize(-xGridTickSize)
                );
            }
        }

        if (isValueText) {
            x = d3
                .scaleBand()
                .domain(dataSets[0].map((e) => e.xValue))
                .range([0, width])
                .padding(0);

            if (showXAxis) {
                d3.select("g #xAxis").call(d3.axisBottom(x).tickSize(xGridTickSize));
            }
        }

        if (isValueNumeric) {
            x = d3
                .scaleLinear()
                .domain(d3.extent(dataSets[0], (d) => d.xValue))
                .range([0, width]);

            if (showXAxis) {
                if (xAxisPosition == "bottom") {
                    d3.select("g #xAxis").call(d3.axisBottom(x));
                }
                if (xAxisPosition == "top") {
                    d3.select("g #xAxis").call(d3.axisTop(x));
                }

                d3.select("g #xAxisGrid").call(
                    d3
                        .axisBottom(x)
                        .tickFormat((d) => "")
                        .tickSize(-xGridTickSize)
                );
            }
        }

        /** Change xAxisGridLineColor */
        var xAxisGridColor = this.settings.xAxis.gridLineColor;
        var xAxisGridLines: any = document
            .getElementById("xAxisGrid")
            .getElementsByTagName("g");
        for (var gTag of xAxisGridLines) {
            gTag.getElementsByTagName("line")[0].style.stroke = xAxisGridColor;
        }

        var y1Left;
        var y1AxisColor = this.settings.yAxis.y1AxisColor;
        var showYAxis = this.settings.yAxis.showYAxis;
        var showYAxisTitle = this.settings.yAxis.showTitle;
        var measure1DataMax = d3.max(measure1Data, d => +d.yValue);
        var measure1DataMin = d3.min(measure1Data, d => +d.yValue);

        var scale1;
        var y1Reverse = this.settings.yAxis.reverse;
        var y1Min = !!this.settings.yAxis.min ? this.settings.yAxis.min : 0;
        var y1Max = (!!this.settings.yAxis.max && this.settings.yAxis.max > y1Min) ? this.settings.yAxis.max : measure1DataMax;
        var y1GridTickSize: number = 0;
        var y1Grid: boolean = this.settings.yAxis.gridLines;

        var y2Right;
        var y2AxisColor = this.settings.y2Axis.y2AxisColor;
        var showY2AxisTitle = this.settings.y2Axis.showTitle;
        var showY2Axis = this.settings.y2Axis.showYAxis;
        var y2Reverse = this.settings.y2Axis.reverse;
        var measure2DataMax = d3.max(measure2Data, d => +d.yValue);
        var measure2DataMin = d3.min(measure2Data, d => +d.yValue);
        var y2Min = this.settings.y2Axis.min ? this.settings.y2Axis.min : 0;
        var y2Max = (!!this.settings.y2Axis.max && this.settings.y2Axis.max > y2Min) ? this.settings.y2Axis.max : measure2DataMax;

        var y2GridTickSize: number = 0;

        if (y1Grid) {
            y1GridTickSize = -width;
        }

        /** Add Y axis */
        /** Add the scale switch buttons */
        var powerValue;
        var controlMode = this.settings.scale.controlMode;
        var scale = "linear";

        if (controlMode == "user") {
            scale = this.createScaleButtons(svg, width, xAxisPosition);
        } else {
            scale = this.settings.scale.designerScaleType
        }

        switch (scale) {
            case "power":
                this.yScale = "pow";
                powerValue = this.settings.scale.powerValue;
                break;
            case "log":
                this.yScale = "log";
                break;
            default:
                this.yScale = "linear";
                break;
        }


        switch (this.yScale) {
            case "pow":
                if (firstMeasure) {
                    var a = ((y1Min == 0 || y1Min) && y1Min > measure1DataMin) ? measure1DataMin : y1Min;
                    var b = ((y1Max == 0 || y1Max) && y1Max < measure1DataMax) ? measure1DataMax : y1Max;
                    if (y1Reverse) {
                        a = ((y1Max == 0 || y1Max) && y1Max < measure1DataMax) ? measure1DataMax : y1Max;
                        b = ((y1Min == 0 || y1Min) && y1Min > measure1DataMin) ? measure1DataMin : y1Min;
                    }
                    y1Left = d3
                        .scalePow()
                        .exponent(1 / powerValue)
                        .domain([a, b])
                        .range([xAxisHeight, 0]);
                    this.addYAxis(
                        svg,
                        y1Left,
                        y1AxisColor,
                        "y1AxisLeft",
                        0,
                        showYAxis,
                        y1GridTickSize
                    );
                }
                if (secondMeasure) {
                    var c = ((y2Min == 0 || y2Min) && y2Min > measure2DataMin) ? measure2DataMin : y2Min;
                    var d = ((y2Max == 0 || y2Max) && y2Max < measure2DataMax) ? measure2DataMax : y2Max;
                    if (y2Reverse) {
                        c = ((y2Max == 0 || y2Max) && y2Max < measure2DataMax) ? measure2DataMax : y2Max;
                        d = ((y2Min == 0 || y2Min) && y2Min > measure2DataMin) ? measure2DataMin : y2Min;
                    }
                    y2Right = d3
                        .scalePow()
                        .exponent(1 / powerValue)
                        .domain([c, d])
                        .range([height, 0]);
                    this.addYAxis(
                        svg,
                        y2Right,
                        y2AxisColor,
                        "y2AxisRight",
                        width,
                        showY2Axis,
                        y2GridTickSize
                    );
                }

                console.log("-------------------POW");
                break;

            case "log":
                y1Min = !!this.settings.yAxis.min ? this.settings.yAxis.min : 1;
                if (firstMeasure) {
                    var a = (y1Min > measure1DataMin && measure1DataMin > 1) ? measure1DataMin : y1Min;
                    var b = (y1Max < measure1DataMax) ? measure1DataMax : y1Max;
                    if (y1Reverse) {
                        a = ((y1Max == 0 || y1Max) && y1Max < measure1DataMax) ? measure1DataMax : y1Max;
                        b = ((y1Min <= 0 || y1Min) && y1Min > measure1DataMin && measure1DataMin > 1) ? measure1DataMin : y1Min;
                    }
                    y1Left = d3.scaleLog().domain([a, b]).range([height, 0]);
                    this.addYAxis(
                        svg,
                        y1Left,
                        y1AxisColor,
                        "y1AxisLeft",
                        0,
                        showYAxis,
                        y1GridTickSize
                    );
                }
                if (secondMeasure) {
                    y2Min = !!this.settings.y2Axis.min ? this.settings.y2Axis.min : 1;
                    var c = ((y2Min <= 0 || y2Min) && y2Min > measure2DataMin && measure2DataMin > 1) ? measure2DataMin : y2Min;
                    var d = ((y2Max == 0 || y2Max) && y2Max < measure2DataMax) ? measure2DataMax : y2Max;
                    if (y2Reverse) {
                        c = ((y2Max == 0 || y2Max) && y2Max < measure2DataMax) ? measure2DataMax : y2Max;
                        d = ((y2Min <= 0 || y2Min) && y2Min > measure2DataMin && measure2DataMin > 1) ? measure2DataMin : y2Min;
                    }
                    y2Right = d3.scaleLog().domain([c, d]).range([height, 0]);
                    this.addYAxis(
                        svg,
                        y2Right,
                        y2AxisColor,
                        "y2AxisRight",
                        width,
                        showY2Axis,
                        y2GridTickSize
                    );
                }
                console.log("-------------------LOG");
                break;

            default:
                if (firstMeasure) {
                    var a = ((y1Min == 0 || y1Min) && y1Min > measure1DataMin) ? measure1DataMin : y1Min;
                    var b = ((y1Max == 0 || y1Max) && y1Max < measure1DataMax) ? measure1DataMax : y1Max;
                    if (y1Reverse) {
                        a = ((y1Max == 0 || y1Max) && y1Max < measure1DataMax) ? measure1DataMin : y1Max;
                        b = ((y1Min == 0 || y1Min) && y1Min > measure1DataMin) ? measure1DataMin : y1Min;
                    }
                    y1Left = d3.scaleLinear().domain([a, b]).range([height, 0]);
                    this.addYAxis(
                        svg,
                        y1Left,
                        y1AxisColor,
                        "y1AxisLeft",
                        0,
                        showYAxis,
                        y1GridTickSize
                    );
                }
                if (secondMeasure) {
                    var c = ((y2Min == 0 || y2Min) && y2Min > measure2DataMin) ? measure2DataMin : y2Min;
                    var d = ((y2Max == 0 || y2Max) && y2Max < measure2DataMax) ? measure2DataMax : y2Max;
                    if (y2Reverse) {
                        c = ((y2Max == 0 || y2Max) && y2Max < measure2DataMax) ? measure2DataMax : y2Max;
                        d = ((y2Min == 0 || y2Min) && y2Min > measure2DataMin) ? measure2DataMin : y2Min;
                    }

                    y2Right = d3.scaleLinear().domain([c, d]).range([height, 0]);
                    this.addYAxis(
                        svg,
                        y2Right,
                        y2AxisColor,
                        "y2AxisRight",
                        width,
                        showY2Axis,
                        y2GridTickSize
                    );
                }
                console.log("-------------------LIN");
                break;
        }

        /** Change xAxisGridLineColor */
        var yAxisGridColor = this.settings.yAxis.gridLineColor;
        var yAxisGridLines: any = document
            .getElementById("y1AxisGrid")
            .getElementsByTagName("g");
        for (var gTag of yAxisGridLines) {
            gTag.getElementsByTagName("line")[0].style.stroke = yAxisGridColor;
        }

        /** Handle show titles */
        this.addAxisTitle(
            svg,
            margin,
            xAxisTitle,
            y1AxisTitle,
            y2AxisTitle,
            xAxisPosition,
            height,
            width,
            showXTitle,
            showYAxisTitle,
            showY2AxisTitle
        );

        /** Add the line */
        const lineChartGroup = svg
            .append("g")
            .attr("class", "line-chart-group")
            .attr("width", width)
            .attr("height", xAxisHeight);

        var colors2: Array<string> = ["orange", "red", "yellow"];

        if (firstMeasure) {
            measure1Datasets.forEach((dataset, index) => {
                this.addLine(dataset, x, y1Left, lineChartGroup, this.yScale);
            });
        }

        if (secondMeasure) {
            measure2Datasets.forEach((dataset, index) => {
                this.addLine(dataset, x, y2Right, lineChartGroup, this.yScale);
            });
        }

        var showLegend = this.settings.legend.show;
        var legendSettings = this.settings.legend;
        if (showLegend) this.renderLegend(this.viewModel.dataSets, legendSettings, xAxisPosition);

        /** Add tooltip */
        var showTooltip = this.settings.tooltip.show;
        if (showTooltip) this.renderTooltip(svg);

        /** Add Context Menu */
        svg.on('contextmenu', () => {
            const mouseEvent: MouseEvent = d3.event as MouseEvent;
            const eventTarget: EventTarget = mouseEvent.target;
            let dataPoint: any = d3Select(<d3.BaseType>eventTarget).datum();

            this.selectionManager.showContextMenu(dataPoint ? dataPoint.selectionId : {}, {
                x: mouseEvent.clientX,
                y: mouseEvent.clientY
            });
            mouseEvent.preventDefault();
        });
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return VisualSettings.parse(dataView) as VisualSettings;
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */

    private addYAxis(
        svg,
        y,
        yAxisTextColor: string,
        yAxisId: string,
        width: number,
        showYAxis: boolean,
        horizontalTickSize: number
    ) {
        var y1AxisFormat = this.settings.yAxis.units;
        var y2AxisFormat = this.settings.y2Axis.units;
        var tickNumber: number = this.yScale == "log" ? 3 : 5;
        var adjustNum: number = this.yScale == "pow" ? 0 : -7

        svg
            .append("g")
            .attr("id", yAxisId)
            .attr("stroke", yAxisTextColor)
            .attr("stroke-width", 0.5);

        switch (yAxisId) {

            /** Y1 Left */
            case "y1AxisLeft":
                if (showYAxis) {
                    switch (y1AxisFormat) {
                        case "auto":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3.axisLeft(y).ticks(tickNumber).tickFormat(d3.format(".2s"))
                                );
                            d3.select("g #y1AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "none":
                            d3.select("g #" + yAxisId).call(
                                d3.axisLeft(y).ticks(tickNumber).tickFormat(d3.format(",.2r"))
                            );
                            d3.select("g #y1AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "thousands":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.2r")(d / 1000) + "K";
                                        })
                                );
                            d3.select("g #y1AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "millions":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.1r")(d / 1000000) + "M";
                                        })
                                );
                            d3.select("g #y1AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "billions":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.1r")(d / 1000000000) + "bn";
                                        })
                                );
                            d3.select("g #y1AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "trillions":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.1r")(d / 1000000000000) + "T";
                                        })
                                );
                            d3.select("g #y1AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisLeft(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        default:
                            return null;
                    }
                }
                break;

            /**Y2 Right */
            case "y2AxisRight":
                if (showYAxis) {
                    switch (y2AxisFormat) {
                        case "auto":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3.axisRight(y).ticks(tickNumber).tickFormat(d3.format(".2s"))
                                );
                            d3.select("g #y2AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "none":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat(d3.format(",.2r"))
                                );
                            d3.select("g #y2AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "thousands":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.2r")(d / 1000) + "K";
                                        })
                                );
                            d3.select("g #y2AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "millions":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.1r")(d / 1000000) + "M";
                                        })
                                );
                            d3.select("g #y2AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "billions":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.1r")(d / 1000000000) + "bn";
                                        })
                                );
                            d3.select("g #y2AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        case "trillions":
                            d3.select("g #" + yAxisId)
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat(function (d: any) {
                                            return d3.format(",.1r")(d / 1000000000000) + "T";
                                        })
                                );
                            d3.select("g #y2AxisGrid")
                                .attr("transform", `translate(${width}, ${adjustNum})`)
                                .call(
                                    d3
                                        .axisRight(y)
                                        .ticks(tickNumber)
                                        .tickFormat((d) => "")
                                        .tickSize(horizontalTickSize)
                                );
                            break;
                        default:
                            return null;
                    }
                }
                break;

            default:
                return null;
        }
    }

    private addAxisTitle(
        svg,
        margin: any,
        xAxisTitle: string,
        yAxisTitle: Array<string>,
        y2AxisTitle: Array<string>,
        xAxisPosition: string,
        height: number,
        width: number,
        isX: boolean,
        isY: boolean,
        isY2: boolean
    ) {
        let yAxisTitleStr = "";
        let y2AxisTitleStr = "";
        yAxisTitle.forEach((t) => {
            yAxisTitleStr = yAxisTitleStr + t + ", ";
        });
        y2AxisTitle.forEach((t) => {
            y2AxisTitleStr = y2AxisTitleStr + t + ", ";
        });
        if (isY) {
            svg
                .append("text")
                .attr("id", "y1Title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -height / 2)
                .text(yAxisTitleStr.substring(0, yAxisTitleStr.length - 2));
        }
        if (isY2) {
            svg
                .append("text")
                .attr("id", "y2Title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("y", width + 45)
                .attr("x", -height / 2)
                .text(y2AxisTitleStr.substring(0, y2AxisTitleStr.length - 2));
        }
        if (isX) {
            var titleHeight = height + 30;
            var xAxisTitleSize = this.settings.xAxis.textSize;
            if (xAxisPosition == "top") {
                titleHeight = -20;
            }
            svg
                .append("text")
                .attr("id", "xAxisTitle")
                .attr("text-anchor", "middle")
                .attr("y", titleHeight - 5)
                .attr("x", width / 2)
                .attr("font-size", xAxisTitleSize)
                .text(xAxisTitle);
        }
    }

    private addLine(data: DataPoint[], x, y, lineChartGroup, scale: string) {
        var lineColor = !!data[0].color ? data[0].color : this.colors[0];
        lineChartGroup
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")

            // Add the ablity to change the color of line
            .attr("stroke", lineColor)
            .attr("stroke-width", 2.5)
            .attr(
                "d",
                d3
                    .line<DataPoint>()
                    .x((d) => x(d.xValue))
                    .y((d) => {
                        if (scale == "log" && d.yValue < 1) {
                            d.yValue = 1
                        }
                        return y(d.yValue)
                    })
            )
            .attr("clip-path", "url(#clip)")
            .attr("transform", "translate(0,-7)");
    }

    private fetchData(dataViews) {
        var categorical = dataViews[0].categorical;
        var categories = categorical.categories;
        var values = categorical.values;
        var isXAxisValueDatetime = categories[0].source.type.dateTime;
        var isXAxisValueText = categories[0].source.type.text;
        var isXAxisValueNumeric = categories[0].source.type.numeric;
        var metadata: any = dataViews[0].metadata;
        var dataSets = [];
        this.legendArray = [];
        this.queryNames = {};

        for (let i = 0; i < metadata.columns.length; i++) {
            this.queryNames[metadata.columns[i].queryName] = !!metadata.columns[i]
                .objects
                ? metadata.columns[i].objects.colorSelector.fill.solid.color
                : this.colors[i];
        }

        if (values.length != 1) {
            if (categories.length == 1) {
                for (let i = 0; i < values.length; i++) {
                    if (this.legendArray.indexOf(values[i].source.displayName) == -1) {
                        this.legendArray.push(values[i].source.displayName);
                    }
                }
                if (isXAxisValueDatetime) {
                    values.map((value) => {
                        let data = [];

                        categories[0].values.map((cat, idx) => {
                            if (value.source.roles.measure1)
                                data.push({
                                    xValue: <Date>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure1",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                            if (value.source.roles.measure2)
                                data.push({
                                    xValue: <Date>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure2",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                        });
                        dataSets.push(data);
                    });
                }
                if (isXAxisValueNumeric) {
                    values.map((value) => {
                        let data = [];
                        var colorIndex = this.legendArray.indexOf(value.source.displayName);
                        categories[0].values.map((cat, idx) => {
                            if (value.source.roles.measure1)
                                data.push({
                                    xValue: <Number>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure1",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                            if (value.source.roles.measure2)
                                data.push({
                                    xValue: <Number>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure2",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                        });
                        dataSets.push(data);
                    });
                }
                if (isXAxisValueText) {
                    values.map((value) => {
                        let data = [];
                        var colorIndex = this.legendArray.indexOf(value.source.displayName);
                        categories[0].values.map((cat, idx) => {
                            if (value.source.roles.measure1)
                                data.push({
                                    xValue: <String>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure1",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                            if (value.source.roles.measure2)
                                data.push({
                                    xValue: <String>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure2",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                        });
                        dataSets.push(data);
                    });
                }
                dataSets[0].sort((a, b) => a.xValue - b.xValue);
            }
            if (categories.length == 2) {
                for (let i = 0; i < categories[1].values.length; i++) {
                    if (this.legendArray.indexOf(categories[1].values[i]) == -1) {
                        this.legendArray.push(categories[1].values[i]);
                    }
                }

                if (this.legendArray.length == 1) {
                    this.legendArray = []
                    for (let i = 0; i < values.length; i++) {
                        if (this.legendArray.indexOf(values[i].source.displayName) == -1) {
                            this.legendArray.push(values[i].source.displayName);
                        }
                    }
                    if (isXAxisValueDatetime) {
                        values.map((value) => {
                            let data = [];

                            categories[0].values.map((cat, idx) => {
                                if (value.source.roles.measure1)
                                    data.push({
                                        xValue: <Date>cat,
                                        yValue: <Number>value.values[idx],
                                        measure: "measure1",
                                        color: this.queryNames[value.source.queryName],
                                        legend: value.source.displayName,
                                        category: value.source.displayName,
                                        identity: this.host
                                            .createSelectionIdBuilder()
                                            .withMeasure(value.source.queryName)
                                            .createSelectionId(),
                                    });
                                if (value.source.roles.measure2)
                                    data.push({
                                        xValue: <Date>cat,
                                        yValue: <Number>value.values[idx],
                                        measure: "measure2",
                                        color: this.queryNames[value.source.queryName],
                                        legend: value.source.displayName,
                                        category: value.source.displayName,
                                        identity: this.host
                                            .createSelectionIdBuilder()
                                            .withMeasure(value.source.queryName)
                                            .createSelectionId(),
                                    });
                            });
                            dataSets.push(data);
                        });
                    }
                    if (isXAxisValueNumeric) {
                        values.map((value) => {
                            let data = [];
                            var colorIndex = this.legendArray.indexOf(value.source.displayName);
                            categories[0].values.map((cat, idx) => {
                                if (value.source.roles.measure1)
                                    data.push({
                                        xValue: <Number>cat,
                                        yValue: <Number>value.values[idx],
                                        measure: "measure1",
                                        color: this.queryNames[value.source.queryName],
                                        legend: value.source.displayName,
                                        category: value.source.displayName,
                                        identity: this.host
                                            .createSelectionIdBuilder()
                                            .withMeasure(value.source.queryName)
                                            .createSelectionId(),
                                    });
                                if (value.source.roles.measure2)
                                    data.push({
                                        xValue: <Number>cat,
                                        yValue: <Number>value.values[idx],
                                        measure: "measure2",
                                        color: this.queryNames[value.source.queryName],
                                        legend: value.source.displayName,
                                        category: value.source.displayName,
                                        identity: this.host
                                            .createSelectionIdBuilder()
                                            .withMeasure(value.source.queryName)
                                            .createSelectionId(),
                                    });
                            });
                            dataSets.push(data);
                        });
                    }
                    if (isXAxisValueText) {
                        values.map((value) => {
                            let data = [];
                            var colorIndex = this.legendArray.indexOf(value.source.displayName);
                            categories[0].values.map((cat, idx) => {
                                if (value.source.roles.measure1)
                                    data.push({
                                        xValue: <String>cat,
                                        yValue: <Number>value.values[idx],
                                        measure: "measure1",
                                        color: this.queryNames[value.source.queryName],
                                        legend: value.source.displayName,
                                        category: value.source.displayName,
                                        identity: this.host
                                            .createSelectionIdBuilder()
                                            .withMeasure(value.source.queryName)
                                            .createSelectionId(),
                                    });
                                if (value.source.roles.measure2)
                                    data.push({
                                        xValue: <String>cat,
                                        yValue: <Number>value.values[idx],
                                        measure: "measure2",
                                        color: this.queryNames[value.source.queryName],
                                        legend: value.source.displayName,
                                        category: value.source.displayName,
                                        identity: this.host
                                            .createSelectionIdBuilder()
                                            .withMeasure(value.source.queryName)
                                            .createSelectionId(),
                                    });
                            });
                            dataSets.push(data);
                        });
                    }
                    dataSets[0].sort((a, b) => a.xValue - b.xValue);
                }

                /** TODO: add ability to handle other category value type */
                else {
                    if (isXAxisValueNumeric) {
                        for (let i = 0; i < this.legendArray.length; i++) {
                            let data = [];
                            categories[0].values.map((cat, idx) => {
                                if (categories[1].values[idx] == this.legendArray[i]) {
                                    if (values[0].source.roles.measure1) {
                                        data.push({
                                            xValue: <Number>cat,
                                            yValue: <Number>values[0].values[idx],
                                            legend: categories[1].values[idx],
                                            measure: "measure1",
                                            color: this.colors[i],
                                            category: values[0].source.displayName,
                                            identity: this.host
                                                .createSelectionIdBuilder()
                                                .withCategory(cat, idx)
                                                .createSelectionId(),
                                        });
                                    }

                                    if (values[0].source.roles.measure2) {
                                        data.push({
                                            xValue: <Number>cat,
                                            yValue: <Number>values[0].values[idx],
                                            legend: categories[1].values[idx],
                                            measure: "measure2",
                                            color: this.colors[i],
                                            category: values[0].source.displayName,
                                            identity: this.host
                                                .createSelectionIdBuilder()
                                                .withCategory(cat, idx)
                                                .createSelectionId(),
                                        });
                                    }
                                }
                            });
                            data.sort((a, b) => a.xValue - b.xValue);
                            dataSets.push(data);
                        }
                    }

                    if (isXAxisValueText) {
                        for (let i = 0; i < this.legendArray.length; i++) {
                            let data = [];
                            categories[0].values.map((cat, idx) => {
                                if (categories[1].values[idx] == this.legendArray[i]) {
                                    if (values[0].source.roles.measure1) {
                                        data.push({
                                            xValue: <String>cat,
                                            yValue: <Number>values[0].values[idx],
                                            legend: categories[1].values[idx],
                                            measure: "measure1",
                                            color: this.colors[i],
                                            category: values[0].source.displayName,
                                            identity: this.host
                                                .createSelectionIdBuilder()
                                                .withCategory(cat, idx)
                                                .createSelectionId(),
                                        });
                                    }
                                    if (values[0].source.roles.measure2) {
                                        data.push({
                                            xValue: <String>cat,
                                            yValue: <Number>values[0].values[idx],
                                            legend: categories[1].values[idx],
                                            measure: "measure2",
                                            color: this.colors[i],
                                            category: values[0].source.displayName,
                                            identity: this.host
                                                .createSelectionIdBuilder()
                                                .withCategory(cat, idx)
                                                .createSelectionId(),
                                        });
                                    }
                                }
                            });
                            data.sort((a, b) => a.xValue - b.xValue);
                            dataSets.push(data);
                        }
                    }

                    if (isXAxisValueDatetime) {
                        for (let i = 0; i < this.legendArray.length; i++) {
                            let data = [];
                            categories[0].values.map((cat, idx) => {
                                if (categories[1].values[idx] == this.legendArray[i]) {
                                    if (values[0].source.roles.measure1) {
                                        data.push({
                                            xValue: <Date>cat,
                                            yValue: <Number>values[0].values[idx],
                                            legend: categories[1].values[idx],
                                            measure: "measure1",
                                            color: this.colors[i],
                                            category: values[0].source.displayName,
                                            identity: this.host
                                                .createSelectionIdBuilder()
                                                .withCategory(cat, idx)
                                                .createSelectionId(),
                                        });
                                    }
                                    if (values[0].source.roles.measure2) {
                                        data.push({
                                            xValue: <Date>cat,
                                            yValue: <Number>values[0].values[idx],
                                            legend: categories[1].values[idx],
                                            measure: "measure2",
                                            color: this.colors[i],
                                            category: values[0].source.displayName,
                                            identity: this.host
                                                .createSelectionIdBuilder()
                                                .withCategory(cat, idx)
                                                .createSelectionId(),
                                        });
                                    }
                                }
                            });
                            data.sort((a, b) => a.xValue - b.xValue);
                            dataSets.push(data);
                        }
                    }
                }
                if (this.legendArray.length == 1) {
                    if (isXAxisValueNumeric) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];

                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <Number>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <Number>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                    if (isXAxisValueText) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];
                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <String>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <String>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                    if (isXAxisValueDatetime) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];
                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <Date>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <Date>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                }
            }
        }
        if (values.length == 1) {
            if (categories.length == 1) {
                for (let i = 0; i < values.length; i++) {
                    if (this.legendArray.indexOf(values[i].source.displayName) == -1) {
                        this.legendArray.push(values[i].source.displayName);
                    }
                }
                if (isXAxisValueDatetime) {
                    values.map((value) => {
                        let data = [];

                        categories[0].values.map((cat, idx) => {
                            if (value.source.roles.measure1)
                                data.push({
                                    xValue: <Date>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure1",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                            if (value.source.roles.measure2)
                                data.push({
                                    xValue: <Date>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure2",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                        });
                        dataSets.push(data);
                    });
                }
                if (isXAxisValueNumeric) {
                    values.map((value) => {
                        let data = [];
                        var colorIndex = this.legendArray.indexOf(value.source.displayName);
                        categories[0].values.map((cat, idx) => {
                            if (value.source.roles.measure1)
                                data.push({
                                    xValue: <Number>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure1",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                            if (value.source.roles.measure2)
                                data.push({
                                    xValue: <Number>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure2",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                        });
                        dataSets.push(data);
                    });
                }
                if (isXAxisValueText) {
                    values.map((value) => {
                        let data = [];
                        var colorIndex = this.legendArray.indexOf(value.source.displayName);
                        categories[0].values.map((cat, idx) => {
                            if (value.source.roles.measure1)
                                data.push({
                                    xValue: <String>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure1",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                            if (value.source.roles.measure2)
                                data.push({
                                    xValue: <String>cat,
                                    yValue: <Number>value.values[idx],
                                    measure: "measure2",
                                    color: this.queryNames[value.source.queryName],
                                    legend: value.source.displayName,
                                    category: value.source.displayName,
                                    identity: this.host
                                        .createSelectionIdBuilder()
                                        .withMeasure(value.source.queryName)
                                        .createSelectionId(),
                                });
                        });
                        dataSets.push(data);
                    });
                }
                dataSets[0].sort((a, b) => a.xValue - b.xValue);
            }

            if (categories.length == 2) {
                for (let i = 0; i < categories[1].values.length; i++) {
                    if (this.legendArray.indexOf(categories[1].values[i]) == -1) {
                        this.legendArray.push(categories[1].values[i]);
                    }
                }

                /** TODO: add ability to handle other category value type */
                if (this.legendArray.length != 1) {
                    if (isXAxisValueNumeric) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];

                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <Number>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.colors[i],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <Number>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.colors[i],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                    if (isXAxisValueText) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];
                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <String>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.colors[i],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <String>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.colors[i],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                    if (isXAxisValueDatetime) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];
                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <Date>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.colors[i],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withCategory(cat, idx)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <Date>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.colors[i],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                }
                if (this.legendArray.length == 1) {
                    if (isXAxisValueNumeric) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];

                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <Number>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <Number>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                    if (isXAxisValueText) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];
                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <String>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <String>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                    if (isXAxisValueDatetime) {
                        values.map((value) => {
                            for (let i = 0; i < this.legendArray.length; i++) {
                                let data = [];
                                categories[0].values.map((cat, idx) => {
                                    if (categories[1].values[idx] == this.legendArray[i]) {
                                        if (value.source.roles.measure1) {
                                            data.push({
                                                xValue: <Date>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure1",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                        if (value.source.roles.measure2) {
                                            data.push({
                                                xValue: <Date>cat,
                                                yValue: <Number>value.values[idx],
                                                legend: categories[1].values[idx],
                                                measure: "measure2",
                                                color: this.queryNames[value.source.queryName],
                                                category: value.source.displayName,
                                                identity: this.host
                                                    .createSelectionIdBuilder()
                                                    .withMeasure(value.source.queryName)
                                                    .createSelectionId(),
                                            });
                                        }
                                    }
                                });
                                data.sort((a, b) => a.xValue - b.xValue);
                                dataSets.push(data);
                            }
                        });
                    }
                }
            }
        }
        return dataSets;
    }

    public getScale() {
        return this.yScale;
    }

    /** Create scale buttons for switching the y-axis */
    private createScaleButtons(
        graph: any,
        width: number,
        xAxisPosition: string
    ): string {
        var cumulativeWidth = 0;

        // Append a group to contain all lines
        var _this = this;

        if (_this.settings.scale.controlMode == "user") {
            var buttonGroup = graph
                .append("svg:g")
                .attr("class", "scale-button-group")
                .attr(
                    "transform",
                    `translate(${width * 0.88}, ${xAxisPosition == "top" ? -30 : -5})`
                )
                .selectAll("g")
                .data(this.scales)
                .enter()
                .append("g")
                .attr("class", "scale-buttons")
                .append("svg:text")
                .attr("class", "scale-button")
                .text(function (d, i) {
                    return d[1];
                })
                .attr("font-size", "10") // this must be before "x" which dynamically determines width
                .attr("fill", function (d) {
                    if (d[0] == _this.yScale) {
                        return "black";
                    } else {
                        return "blue";
                    }
                })
                .classed("selected", function (d) {
                    if (d[0] == _this.yScale) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .attr("x", function (d, i) {

                    // return it at the width of previous labels (where the last one ends)
                    var returnX = cumulativeWidth;

                    // increment cumulative to include this one
                    cumulativeWidth += this.getComputedTextLength() + 5;
                    return returnX + 4;
                })
                .attr("y", 4)
                .on("click", function (d, i) {
                    console.log("onclick", d, i);
                    if (i == 0) {
                        _this.yScale = "linear";
                        appInsights.trackEvent({ name: 'click linear' });
                    } else if (i == 1) {
                        _this.yScale = "log";
                        appInsights.trackEvent({ name: 'click log' });
                    }
                    console.log("Clickety ---> ", i);

                    // change text decoration
                    graph
                        .selectAll(".scale-button")
                        .attr("fill", function (d) {
                            if (d[0] == _this.yScale) {
                                return "black";
                            } else {
                                return "blue";
                            }
                        })
                        .classed("selected", function (d) {
                            if (d[0] == _this.yScale) {
                                return true;
                            } else {
                                return false;
                            }
                        });

                    _this.settings.scale.type = _this.yScale
                    _this.settings.scale.designerScaleType = _this.yScale
                    _this.update(_this.myOptions);
                });
        }
        return _this.yScale
    }

    /** Create function for rendering tooltip */
    private renderTooltip(svg) {
        this.tooltipServiceWrapper.addTooltip(
            svg.selectAll(".line"),
            (tooltipEvent: TooltipEventArgs<any>) =>
                this.getTooltipData(tooltipEvent),
            (tooltipEvent: TooltipEventArgs<any>) => null
        );
    }

    private getTooltipData(value: any): VisualTooltipDataItem[] {

        appInsights.trackEvent({ name: 'render tooltip' })

        var index = Math.round(
            (value.elementCoordinates[0] * value.data.length) /
            parseInt(d3.select(".line-chart-group").attr("width"))
        );

        var dataPoint = value.data[index];

        return [
            {
                header: dataPoint.category,
                displayName:
                    typeof dataPoint.xValue == "string"
                        ? dataPoint.xValue
                        : dataPoint.xValue.toDateString(),
                value: dataPoint.yValue.toFixed(2).toString(),
            },
        ];
    }

    /** Create the element used to manage the legend */
    private renderLegend(
        dataSets: Array<any>,
        legendSettings: any,
        xAxisPosition: string
    ) {
        this.legendArray = [];
        this.serieColors = [];

        dataSets.map((dataArray, index) => {
            let ellipsis = dataArray[0].legend.length > 12 ? "..." : "";
            if (this.legendArray.indexOf(dataArray[0].legend.substring(0, 12) + ellipsis) == -1) {
                this.legendArray.push(dataArray[0].legend.substring(0, 12) + ellipsis);
            }
            else {
                this.legendArray.push(dataArray[0].legend.substring(0, 13) + ellipsis);
            }

            this.serieColors.push(dataArray[0].color);
        });

        var ordinal = d3
            .scaleOrdinal()
            .domain(this.legendArray)
            .range(this.serieColors);
        var showTitle = legendSettings.title;
        var legendName = legendSettings.legendName;
        var textSize = legendSettings.textSize;
        var fontFamily = legendSettings.fontFamily;
        var textColor = legendSettings.color;
        var position = legendSettings.position;
        var mainSize = this.myOptions.viewport;
        var mainChartX: number;
        var mainChartY: number;
        var legendX: number;
        var legendY: number;
        var style = legendSettings.style;
        var shape = style == "circle" ? "r" : "x2";

        switch (position) {
            case "top":
                mainChartX = 60;
                mainChartY = 20;
                legendX = 50;
                legendY = 5;
                if (xAxisPosition == "top") {
                    mainChartY = 36;
                }
                break;
            case "bottom":
                mainChartX = 60;
                mainChartY = 30;
                if (xAxisPosition == "bottom") mainChartY = 15;
                legendX = 50;
                legendY = mainSize.height - 5;
                break;
            case "topCenter":
                mainChartX = 60;
                mainChartY = 20;
                if (xAxisPosition == "top") mainChartY = 36;
                legendX = mainSize.width / 3;
                legendY = 5;
                break;
            case "bottomCenter":
                mainChartX = 60;
                mainChartY = 30;
                if (xAxisPosition == "bottom") mainChartY = 15;
                legendX = mainSize.width / 3;
                legendY = mainSize.height - 5;
                break;
            default:
                return null;
        }

        d3.select("#main")
            .append("g")
            .attr("id", "legend")
            .attr("class", "legend")
            .attr("transform", `translate(${legendX}, ${legendY})`);

        d3.select("#main-chart").attr(
            "transform",
            `translate(${mainChartX}, ${mainChartY})`
        );

        /** TODO: change legend style based on legend.style */
        var legendOrdinal = d3Legend
            .legendColor()
            .shape(style)
            .shapePadding(60)
            .orient("horizontal")
            .scale(ordinal);

        d3.select(".legend").call(legendOrdinal);
        d3.selectAll(".swatch").attr(shape, 5);

        d3.selectAll(".label")
            .attr("transform", "translate(6,3)")
            .attr("style", "text-anchor: left")
            .style("font-size", textSize)
            .style("font-family", fontFamily)
            .style("fill", textColor);

        if (showTitle) {
            d3.select("#main")
                .append("g")
                .attr("id", "legendTitle")
                .attr("transform", `translate(${legendX - 45}, ${legendY + 3})`)
                .style("font-size", textSize)
                .style("font-family", fontFamily)
                .style("fill", textColor)
                .append("text")
                .text(legendName);
        }
    }
}
