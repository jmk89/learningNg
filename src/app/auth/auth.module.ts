import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        RouterModule.forChild([{path: '', component: AuthComponent}]),
        FormsModule,
        CommonModule,
        SharedModule // need this for loading-spinner
    ],
    exports: [
        RouterModule
    ]
})
export class AuthModule {}