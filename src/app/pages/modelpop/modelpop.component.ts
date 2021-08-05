import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { ToastService } from '../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-modelpop',
  templateUrl: './modelpop.component.html',
  styleUrls: ['./modelpop.component.less']
})
export class ModelpopComponent implements OnInit  {
  
  modalTitle: string;
  modalMessage: string;
  modalType:ModalType = ModalType.INFO;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.modalTitle = data.title;
    this.modalMessage = data.message;
    this.modalType = data.type;
    
    console.log(data)
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
export enum ModalType {
  INFO = 'info',
  WARN = 'warn'
}