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

"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class XAxisSettings {
  public showXAxis: boolean = true;
  public showTitle: boolean = true;
  public xAxisPosition: string = "bottom";
  public textColor: string = "black";
  public textSize: number = 10;
  public gridLines: boolean = false;
  public gridLineStyle: string = "xAxisGridDotted";
  public gridLineColor: string = "#b6b6b6";
}

// Y axis settings of Formatting
export class YAxisSettings {
  public showTitle: boolean = true;
  public showYAxis: boolean = true;
  public reverse: boolean = false;
  public units: string = "auto";
  public min: number = null;
  public max: number = null;
  public y1AxisColor: string = "steelblue";
  public gridLines: boolean = true;
  public gridLineStyle: string = "y1AxisGridDotted";
  public gridLineColor: string = "#d3d3d3";
}

// Y2 axis settings of Formatting
export class Y2AxisSettings {
  public showTitle: boolean = true;
  public showYAxis: boolean = true;
  public reverse: boolean = false;
  public units: string = "auto";
  public min: number = null;
  public max: number = null;
  public y2AxisColor: string = "black";
}

// Tooltip settings
export class TooltipSettings {
  public show: boolean = true;
}

// Scale settings
export class ScaleSettings {
  public controlMode: string = "user";
  public type: string = "";
  public designerScaleType: string = "linear";
  public powerValue: number = 2;
}

// Legend settings 
export class LegendSettings {
  public show: boolean = true;
  public position: string = "top";
  public title: boolean = true;
  public legendName: string = "Legend";
  public color: string = "black";
  public fontFamily: string = "Segoe UI";
  public textSize: number = 10;
  public style: string = "circle";
}

// Visual settings
export class VisualSettings extends DataViewObjectsParser {
  public xAxis: XAxisSettings = new XAxisSettings();
  public yAxis: YAxisSettings = new YAxisSettings();
  public y2Axis: Y2AxisSettings = new Y2AxisSettings();
  public tooltip: TooltipSettings = new TooltipSettings();
  public legend: LegendSettings = new LegendSettings();
  public scale: ScaleSettings = new ScaleSettings();
}
