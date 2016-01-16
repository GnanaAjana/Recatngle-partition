(function() {
    'use strict';

    angular.module('app.directive', [])
        .directive('matrixchart', matrixchart);
   

    function matrixchart() {
        return {
            restrict: 'EA',
            scope: {
                data: '=ngModel'
            },
            link: function(scope, elem, attrs) {

                var length = 300,
                    breath = 200,
                    data = scope.data,
                    splitCount = 0,
                    row = 2,
                    totArea = 0,
                    svgContainer,
                    svgNS,
                    g1, g2, count = 1,
                    xPosition = 0,
                    initialState = 0,
                    rect,
                    text,
                    textNode,
                    firstRowObj,
                    secRowObj,
                    svgObj,
                    rectangleObj,
                    textObj,
                    RowObjects;

                /* row object class intialisation */

                RowObjects = function() {
                    this.areas = [];
                    this.data = [];
                    this.length = 0;
                    this.overallLength = 0;
                    this.breath = 0;
                    this.lengths = [];
                }
                RowObjects.prototype = {
                    // calculates one part  row length
                    onePartLength: function(length) {
                        // this.length = (this.overallLength) ? length / this.overallLength : 0;
                        this.length = length / this.overallLength;
                        this.lengthCalculation();
                    },
                    //calculates percentage of lengths
                    lengthCalculation: function() {
                        var self = this;
                        this.data.forEach(function(value) {
                            self.lengths.push(value * self.length)
                        });
                    },
                    //calculate one part of breath
                    firstBreath: function() {
                        this.breath = this.length ? (this.areas[initialState] / (this.data[initialState] * this.length)) : 0; // calculates breadth of first row by calculating first row length
                    },
                    //calculate remaining part of breath
                    secondBreath: function(breath, onePartBreath) {
                        this.breath = breath - onePartBreath; // calculates breadth of second row
                    }
                }


                firstRowObj = new RowObjects(); // first row instance
                secRowObj = new RowObjects(); // second row instance

                /* Number of columns in first row */

                splitCount = Math.round(data.length / row);

                /* Total area of rectangle */

                totArea = length * breath;

                /* first and second row datas */
                console.log(data)
                data.forEach(function(value, index) {
                    // first row values
                    if (index < splitCount) {

                        firstRowObj.data.push(value); // first row datas
                        firstRowObj.areas.push((value / 100) * totArea); // calculates indidiual area of rectangle
                        firstRowObj.overallLength += value; // calculates overall length in first row
                    }
                    // second row values
                    else {
                        secRowObj.data.push(value); // second row datas
                        secRowObj.areas.push((value / 100) * totArea); // calculates indidiual area of rectangle
                        secRowObj.overallLength += value; // calculates overall length in second row
                    }
                });

                firstRowObj.onePartLength(length);
                secRowObj.onePartLength(length);
                firstRowObj.firstBreath();
                secRowObj.secondBreath(breath, firstRowObj.breath);

                var Container = function(width, height) {
                    this.width = width;
                    this.height = height;
                }

                var rectangle = function(width, height, className, xValue) {
                    this.width = width;
                    this.height = height;
                    this.class = className;
                    this.x = xValue;
                }

                function TextArea(className, yValue, xValue) {
                    this.class = className;
                    this.y = yValue;
                    this.x = xValue;
                }

                function CreateElement(element) {
                    return document.createElementNS(svgNS, element);
                }

                function setAttributes(el, attrs) {
                    angular.forEach(attrs, function(value, key) {
                        el.setAttribute(key, value);
                    });
                }

                /* create svg container */

                svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgObj = new Container(length, breath);
                setAttributes(svgContainer, svgObj);
                svgNS = svgContainer.namespaceURI;

                /* create first row grouping in svg  */

                g1 = CreateElement('g');
                g1.setAttribute('transform', 'translate(0,0)');

                /* create second row grouping in svg  */

                g2 = CreateElement('g');
                g2.setAttribute('transform', 'translate(0,' + firstRowObj.breath + ')');

                function plotRectangle(lengths, breath, g, data) {
                    var xValue = 0;
                    lengths.forEach(function(value, index) {
                        xPosition = index;
                        rect = CreateElement('rect');
                        text = CreateElement('text');
                        rectangleObj = new rectangle(value, breath, 'chart' + (count))
                        textObj = new TextArea('text', breath / 2);

                        if (index === 0) {
                            rectangleObj.x = initialState;
                            textObj.x = value / 2; // center position of length in first rectangle
                        } else {
                            rectangleObj.x = xValue;
                            textObj.x = (value / 2) + xValue; // center position of length in next upcoming rectangle
                        }
                        xValue += value;
                        setAttributes(rect, rectangleObj);
                        setAttributes(text, textObj);
                        textNode = document.createTextNode(data[index]);
                        text.appendChild(textNode);
                        g.appendChild(rect);
                        g.appendChild(text);
                        count++;
                    });
                }
                /* Draw rectangles for first row */

                plotRectangle(firstRowObj.lengths, firstRowObj.breath, g1, firstRowObj.data);

                /* Draw rectangles for second row */

                plotRectangle(secRowObj.lengths, secRowObj.breath, g2, secRowObj.data)

                svgContainer.appendChild(g1);
                svgContainer.appendChild(g2);

                document.getElementById('matrixChart').appendChild(svgContainer);

            },
            template: "<div id='matrixChart'></div>" 
        };
    }

})();