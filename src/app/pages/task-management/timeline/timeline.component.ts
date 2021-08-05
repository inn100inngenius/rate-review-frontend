import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/filter';
import { TaskApiService } from '../task-api.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})

export class TimelineComponent implements OnInit {
  param: string;
  multitimeline: boolean;
  id;
  timelines=[];
  constructor(private route: ActivatedRoute,private taskApiService: TaskApiService) { 
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          
        }
      );
  }

  ngOnInit(): void {
    // this.route.queryParams
    //   .filter(params => params.multi)
    //   .subscribe(params => {
    //     this.param = params.multi;
    //   }
    // );

    // this.multitimeline = this.param == "true" ? true : false;
    // console.log(this.multitimeline); 
this.getTaskTimeline();
  }
  taskTitle;
  taskOwner;
  taskDueDate;
getTaskTimeline(){
  var data = {task_id : this.id}
  this.taskApiService.getTaskTimeline(data).subscribe(
    data => {
      this.timelines = data;
       console.log(data);
       if(this.timelines.length > 0){
        this.taskTitle = this.timelines[0].task_title;
        this.taskOwner = this.timelines[0].task_owner;
        this.taskDueDate = this.timelines[0].due_date;
       }
      
       this.timelines.map(x => {
        x.task_audit = x.task_audit == null ?[]:JSON.parse(x.task_audit);

        let totalPercentage =0;
        // if(x.user_task_status == 0){ totalPercentage =  33.3  }
        // if(x.user_task_status == 1){ totalPercentage =  66.6  }
        // if(x.user_task_status == 2){ totalPercentage =  99.9  }
        if(x.user_task_status == 0){ totalPercentage = totalPercentage + 20  }
        if(x.user_task_status == 1){ totalPercentage = totalPercentage + 40  }
        if(x.user_task_status == 2){ totalPercentage = totalPercentage + 60  }
        if(x.user_approve_status == 1){ totalPercentage = totalPercentage + 20  }
        if(x.user_review_status == 1){ totalPercentage = totalPercentage + 20  }
         x['task_percentage'] = totalPercentage;
         
           
       })
   
      
    },
    err => {
    })
}
}
