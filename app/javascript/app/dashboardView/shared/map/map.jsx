import React, { useEffect, useState } from 'react';
import './map.scss';
import * as d3 from 'd3';

const MapData = () => {
    const [coordinateData, setCoordinateData] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        getMapData();
    }, []);

    useEffect(() => {
        if (coordinateData) {
            drawMap(coordinateData);
            drawLegend();
        }
    }, [coordinateData]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function getMapData() {
        fetch('https://saral.ccdms.in/kml/state_geo_json?level=[]')
            .then((response) => response.json())
            .then((result) => {
                setCoordinateData(result);
                console.log("bound", result);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const colorScale = d3.scaleLinear()
        .domain([0, 600])
        .range(['#FFFFFF', '#FF9955']);

    function drawMap(data) {
        const width = 800;
        const height = 600;
        d3.select('#content svg').remove();
        const svg = d3.select('#content')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        const mapGroup = svg.append('g').attr('class', 'map');
        let projection = d3.geoMercator()
            .fitSize([width, height], data);
        let geoGenerator = d3.geoPath().projection(projection);
        mapGroup.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', geoGenerator)
            // .style('fill', function (d) {
            //     return colorScale(d.value);
            // })
            .style('fill', "#FFF9F5" )
            .style('stroke', '#FF9559')
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        const centroids = mapGroup.selectAll('.centroid')
            .data(data.features, d => d.properties.name)
            .enter()
            .append('circle')
            .attr('class', 'centroid')
            .attr('cx', d => projection(d3.geoCentroid(d))[0])
            .attr('cy', d => projection(d3.geoCentroid(d))[1])
            .attr('r', 0) // Start with radius 0
            .style('fill', '#FF9559')
            .style('stroke', '#FFF9F5')
            .style('opacity', 0.5);

        centroids.transition()
            .duration(5000)
            .ease(d3.easeCubicInOut)
            .attr('r', 20) // Final radius
            .style('opacity', 0)
            .transition()
            .duration(0)
            // .delay(5000)
            .attr('r', 20)
            .style('opacity', 1)
            .attr('r', 40)
            .style('opacity', 0)
            .on('end', function () {
                d3.select(this)
                    .transition()
                    .duration(0)
                    .delay(0)
                    .ease(d3.easeLinear)
                    .attr('r', 20)
                    .style('opacity', 1)
                    .attr('r', 40)
                    .style('opacity', 0)
                    .transition()
                    .duration(0)
                    .delay(0)
                    .on('start', function() {
                        d3.select(this).attr('r', 0).style('opacity', 1);
                    });
            });


        centroids.append('animate')
            .attr('attributeName', 'r')
            .attr('from', '0')
            .attr('to', '15')
            .attr('begin', '0s')
            .attr('dur', 'indefinite');
    }

    function handleMouseOver(e, d) {
        d3.select("#tooltip")
            .style("display", "block")
            .html(`<strong>${d.properties.name + " | " + formatIndianNumber(d.value) + " (" + d.percentage + "%)"} </strong>`)
            .style("left", e.pageX + "px")
            .style("top", e.pageY + "px");
    }

    function handleMouseOut() {
        d3.select("#tooltip").style("display", "none");
    }

    function formatIndianNumber(number) {
        if (typeof number == 'string') {
            return number;
        }
        const numericValue = parseInt(number, 10);
        return new Intl.NumberFormat('en-IN').format(numericValue);
    }

    function drawLegend() {
        const legendWidth = 200;
        const legendHeight = 10;
        const legendMargin = { top: 20, right: 30, bottom: 10, left: 70 };
        d3.select('#legend-svg').remove();
        const legendSvg = d3.select('#content')
            .append('svg')
            .attr('id', 'legend-svg')
            .attr('width', legendWidth + legendMargin.left + legendMargin.right)
            .attr('height', legendHeight + legendMargin.top + legendMargin.bottom + 4)
            .append('g')
            .attr('transform', `translate(${legendMargin.left}, ${legendMargin.top})`);
        const gradient = legendSvg.append('defs')
            .append('linearGradient')
            .attr('id', 'legend-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#FFFFFF');
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#FF9955');
        legendSvg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('stroke', '#4D4D4D')
            .style('stroke-width', '0.5px')
            .style('fill', 'url(#legend-gradient)')
            .style('rx', '5px')
            .style('ry', '8px')
            .style('z-index', '2')
            .text('Total Outreached %');
        legendSvg.append('text')
            .attr('x', legendWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-family', 'poppins')
            .text('Total Outreached %');
        legendSvg.append('text')
            .attr('x', 1.532609)
            .attr('y', 22)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', '400')
            .style('font-family', 'poppins')
            .style('stroke', '#4D4D4D')
            .text('0%');
        legendSvg.append('text')
            .attr('x', legendWidth + 4)
            .attr('y', 21)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', '400')
            .style('font-family', 'poppins')
            .style('stroke', '#4D4D4D')
            .text('60,00,000');
    }

    return (
        <>
            <div id="content"></div>
            <div id="tooltip" style={{ display: "none" }}></div>
            <div id="tooltip-legend" style={{ display: "none" }}></div>
        </>
    );
}

export default MapData;
