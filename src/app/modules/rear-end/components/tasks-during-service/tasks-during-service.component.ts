import { Component, OnInit } from '@angular/core';
import { TasksDuringServiceService } from '../../service/tasks-during-service.service';
import { tasksDuringServiceCustomFieldData } from '../../service/tasks-during-serviceCustomFieldData';

@Component({
  selector: 'app-tasks-during-service',
  templateUrl: './tasks-during-service.component.html',
  styleUrls: ['./tasks-during-service.component.scss']
})
export class TasksDuringServiceComponent implements OnInit {
  public filterData;
  public serviceNameClass;
  public methodName;
  public tableFields;
  public treeFields;
  public exportMethod;
  public bigId;
  constructor(private tasksDuringServiceService: TasksDuringServiceService) { }

  ngOnInit() {
    this.serviceNameClass = this.tasksDuringServiceService;
    this.methodName = 'queryServiceTasks';
    this.tableFields = tasksDuringServiceCustomFieldData;
    this.treeFields = ['chooseId', 'chooseId', 'chooseId', 'chooseId'];
    this.exportMethod = 'exportServiceTasks';
  }
  getFilterData(data) {
    this.filterData = { ...data };
  }

}
