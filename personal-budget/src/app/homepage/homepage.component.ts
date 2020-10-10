import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor:[
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
  constructor(private http: HttpClient) {
    const ctx = document.getElementById('myChart');
   }

   ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for ( var i = 0; i < res.myBudget.length; i++){
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
    }
    this.createChart();
    });
  }
  createChart(){
    var ctx = document.getElementById('myChart');
    var pieChart = new Chart(ctx,{
        type: "pie",
        data: this.dataSource
    });
};
}
