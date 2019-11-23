import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import { dateLessThan } from '../../validators'
import { Chart } from 'chart.js'

import { DashboardService } from './dashboard.services'
import { LoaderService } from '../../services/loader.service'
import { HelperService } from '../../services/helper.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  public searchForm: FormGroup
  public startDate: AbstractControl
  public endDate: AbstractControl

  dashboardData: any = []
  public config = {
    type: 'doughnut',
    data: {
      labels: ['Failed', 'Successful'],
      datasets: [
        {
          label: 'Rate',
          backgroundColor: [
            'rgba(255, 82, 122, 0.75)',
            'rgba(54, 162, 235, 0.75)'
          ],
          borderColor: ['rgba(255, 82, 122, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function(tooltipItems, data) {
            return (
              data.datasets[tooltipItems.datasetIndex].data[
                tooltipItems.index
              ] + ' %'
            )
          }
        }
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          fontSize: 10
        }
      },
      title: {
        display: true,
        position: 'bottom',
        padding: 20,
        text: 'Success vs Failure Rate'
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  }

  constructor(
    fb: FormBuilder,
    private dashboardService: DashboardService,
    public loaderService: LoaderService,
    private helperService: HelperService
  ) {
    this.searchForm = fb.group(
      {
        startDate: [''],
        endDate: ['']
      },
      { validator: dateLessThan('startDate', 'endDate') }
    )
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
  }

  ngOnInit() {
    const now = new Date()
    const prev24 = new Date()
    prev24.setHours(prev24.getHours() - 24)
    const currentEndDate = this.helperService.setDateInput(now)
    const currentStartDate = this.helperService.setDateInput(prev24)

    this.searchForm.setValue({
      startDate: currentStartDate,
      endDate: currentEndDate
    })
    this.getDashboardData()
  }

  updateDate(newVal: NgbDateStruct, curr: AbstractControl): void {
    curr.setValue(newVal)
  }

  getDashboardData() {
    const body = {
      startDate: this.helperService.formatDateInput(this.startDate.value),
      endDate: this.helperService.formatDateInput(this.endDate.value, true)
    }

    this.dashboardService.getDashboardData(body).subscribe(response => {
      this.dashboardData = response.dashboard
      setTimeout(() => this.drawChart(), 500)
    })
  }

  drawChart() {
    this.dashboardData.map((data, index) => {
      const ele = document.getElementById(`canvas${index}`)
      let config = { ...this.config }

      if (data.chart && data.volume === 0) {
        config.data = {
          labels: ['No data'],
          datasets: [
            {
              label: 'Rate',
              backgroundColor: ['#D3D3D3'],
              borderColor: ['#D3D3D3'],
              borderWidth: 1
            }
          ]
        }
      } else {
        config = { ...this.config }
      }

      return data.chart
        ? {
            ...data,
            chartObj: new Chart(ele, {
              ...config,
              data: {
                ...config.data,
                datasets: [
                  {
                    ...config.data.datasets[0],
                    data: [data.chart.failureRate, data.chart.successRate]
                  }
                ]
              }
            })
          }
        : { ...data }
    })
  }
}
