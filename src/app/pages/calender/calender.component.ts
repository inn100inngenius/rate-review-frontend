import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi ,FullCalendarComponent } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ViewEventComponent } from './view-event/view-event.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarApiService} from './calendar-api.service';
import { formatDate } from '@angular/common';
import { reduce } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  // handleDateSelect: any;
  // handleEventClick: any;
  // handleEvents: any;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarVisible = true;
  constructor( private breadcrumbService: BreadcrumbService,private modalService :NgbModal,
    private calendarApiService:CalendarApiService,private router: Router,
    private localStorageService:LocalStorageService) {
   

   }
 
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  ngOnInit(): void {
    this.getAllTasks();
  }
  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
   // console.log(selectInfo);
    // const title = prompt('Please enter a new title for your event');
   
    // const calendarApi = this.calendarComponent.getApi();

    // calendarApi.unselect(); // clear date selection

    // if (title) {
      
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event.id);
    this.router.navigate(['/task-management/view/'+clickInfo.event.id]);
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  //   const modalRef = this.modalService.open(ViewEventComponent, { size: 'md' });
  // modalRef.componentInstance.name = "World";
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  taskList;
  getAllTasks() {
    var formDta ={
    
      user_id:this.localStorageService.getValue().userId,
      user_type:this.localStorageService.getValue().userType,
      customer_id:this.localStorageService.getValue().customerId,
      property_ids:this.localStorageService.getValue().propertyIds,
      filter_properties:"",
      filter_roles:"",
      filter_users:""
    }
    this.calendarApiService.getAllTasks(formDta).subscribe(
      data => {
        console.log(data);
        this.taskList = data
        this.taskList.map(x => {
          x.task_users = JSON.parse(x.task_users);
          x.start_date = formatDate(x.start_date, 'y-MM-dd', 'en-US');
          x.due_date = formatDate(x.due_date, 'y-MM-dd', 'en-US');
          x['days_to_due'] = this.calculateDiff(x.due_date);
          x.task_approvers = JSON.parse(x.task_approvers);
          x.task_approvers.map(itm => {
            if (itm.user_id == localStorage.getItem('userId')) {
              x['my_approval'] = true;
            }
          })
          x.task_reviewers = JSON.parse(x.task_reviewers);
          x.task_reviewers.map(itm => {
            if (itm.user_id == localStorage.getItem('userId')) {
              x['my_reviewal'] = true;
            }
          })
         
          let bgColor = x['days_to_due'] > 10 ?'#17a2b8':
                        x['days_to_due'] <= 10 &&  x['days_to_due'] >= 5 ?'#ffc107':
                        x['days_to_due'] < 5 && x['days_to_due'] >= 0 ?'#dc3545':'black'; 
          let txtColor = bgColor == '#ffc107'?'black':'white';
          let priority = x.priority == 1?'#dc3545':
                         x.priority == 2?'#ffc107':'#3bb001';
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.addEvent({
            id: x.id,
            title:x.task_title,
            start:x.start_date,
            end: x.due_date,
            allDay: true,
            backgroundColor:bgColor,
            color:priority,
            textColor:txtColor
          });
        })
      },
      err => {
      })
  }
  calculateDiff(sentDate) {
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
