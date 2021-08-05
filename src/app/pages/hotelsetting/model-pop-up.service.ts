import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModelpopComponent } from '../modelpop/modelpop.component';

@Injectable()
export class DialogService {

  constructor(public dialog: MatDialog) { }

  openModal(title:string, message:string, yes:Function = null, no:Function = null) {
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        title: title,
        message:message
    };
    dialogConfig.minWidth = 400;

    const dialogRef = this.dialog.open(ModelpopComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(yes){
          yes();
        }
      }else{
        if(no){
          no();
        }
      }
        
    });
  }


}