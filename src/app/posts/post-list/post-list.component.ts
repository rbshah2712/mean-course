import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs';



@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

    posts: Post[] = [];
    private postsSub: Subscription | undefined;
    isLoading = false;

    constructor(private PostService:PostsService){
        
    }

    ngOnInit() {
       this.isLoading = true;
       this.PostService.getPosts();
        this.postsSub = this.PostService.getPostUpdateListener().subscribe((posts:Post[]) => {
            this.isLoading = false;
            this.posts = posts;
        });
    }

    onDelete(postId: string) {
       this.PostService.deletePost(postId);
    }
          

    ngOnDestroy(){
        this.postsSub?.unsubscribe();
    }
}