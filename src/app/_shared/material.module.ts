import { NgModule, Component } from "@angular/core";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatButtonModule} from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  exports: [
    MatSidenavModule,
    MatSliderModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule
  ]
})
export class MaterialModule {}