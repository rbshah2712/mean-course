import { NgModule } from "@angular/core";
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from "./post-list/post-list.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    imports:[
        ReactiveFormsModule,
        AngularMaterialModule,
        AppRoutingModule,
        CommonModule
    ]
})
export class PostsModule {

}