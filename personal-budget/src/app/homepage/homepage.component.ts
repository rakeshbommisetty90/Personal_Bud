import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { ServiceService } from '../service.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {
  public color;
  public svg;
  public width;
  public height;
  public radius;
  public pie;
  public arc;
  public outerArc;
  public key;
  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                'blue',
                'green',
                'red',
                '#2d545e',
                '#9df9ef',
                '#edf756',
                'gray',
                'brown',
                'pink'
            ]
        }
    ],
    labels: []
};
  constructor(private dataService:ServiceService) {
    const ctx = document.getElementById('myChart');
   }

   ngAfterViewInit(): void {
    this.dataService.getData().subscribe((data) =>{
      let labelArray = [];
      let budgetArr = [];
      data.myBudget.map((item, key)=>{
        labelArray.push(item.title);
        budgetArr.push(item.budget);
      });
      this.dataSource.datasets[0].data = budgetArr;
      this.dataSource.labels = labelArray;
    this.createChart();
    this.renderD3JSChart();
    });
  }
  createChart(){
    var ctx = document.getElementById('myChart');
    var pieChart = new Chart(ctx,{
        type: "pie",
        data: this.dataSource
    });
};

renderD3JSChart(){
  this.color = d3.scale.ordinal()
  .domain(this.dataSource.labels)
  .range(this.dataSource.datasets[0].backgroundColor);
  this.svg = d3.select("#chart")
  .append("svg")
  .append("g")

this.svg.append("g")
.attr("class", "slices");
this.svg.append("g")
.attr("class", "labels");
this.svg.append("g")
.attr("class", "lines");

this.width = 960,
this.height = 450,
this.radius = Math.min(this.width, this.height) / 2;

this.pie = d3.layout.pie()
.sort(null)
.value(function(d) {
    return d.value;
});

this.arc = d3.svg.arc()
.outerRadius(this.radius * 0.8)
.innerRadius(this.radius * 0.4);

this.outerArc = d3.svg.arc()
.innerRadius(this.radius * 0.9)
.outerRadius(this.radius * 0.9);

this.svg.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");


this.key = function(d){ return d.data.label; };
this.createDonutChart(this.budgetDataD31(this.dataSource), this.color, this.arc, this.outerArc, this.radius);
}

budgetDataD31(dataSource){
  var labels = this.color.domain();
  var i=0;
  return labels.map(function(label){
      return { label: label, value: dataSource.datasets[0].data[i++] }
  });
}

createDonutChart(data,color,arc,outerArc,radius) {
  /* ------- PIE SLICES -------*/
  var slice = this.svg.select(".slices").selectAll("path.slice")
    .data(this.pie(data), this.key);

  slice.enter()
    .insert("path")
    .style("fill", function(d) { return color(d.data.label); })
    .attr("class", "slice");

  slice
    .transition().duration(1000)
    .attrTween("d", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            return arc(interpolate(t));
        };
    })

  slice.exit()
    .remove();

  /* ------- TEXT LABELS -------*/

  var text = this.svg.select(".labels").selectAll("text")
    .data(this.pie(data), this.key);

  text.enter()
    .append("text")
    .attr("dy", ".35em")
    .text(function(d) {
        return d.data.label;
    });

  function midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }

  text.transition().duration(1000)
    .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
        };
    })
    .styleTween("text-anchor", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start":"end";
        };
    });

  text.exit()
    .remove();

  /* ------- SLICE TO TEXT POLYLINES -------*/

  var polyline = this.svg.select(".lines").selectAll("polyline")
    .data(this.pie(data), this.key);

  polyline.enter()
    .append("polyline");

  polyline.transition().duration(1000)
    .attrTween("points", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
    });
  polyline.exit()
    .remove();
  }

}
