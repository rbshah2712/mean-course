import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs';
import { PageEvent } from "@angular/material/paginator";



@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

    posts: Post[] = [];
    private postsSub: Subscription | undefined;
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 1;
    pageSizeOptions = [1,2,5,10];
    currentPage = 1;

    constructor(private PostService:PostsService){
        
    }

    ngOnInit() {
       this.isLoading = true;
       this.PostService.getPosts(this.postsPerPage,1);
        this.postsSub = this.PostService.getPostUpdateListener().subscribe((postData: {posts:Post[],postCount:number}) => {
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.PostService.getPosts(this.postsPerPage,this.currentPage);
    }

    onDelete(postId: string) {
       this.isLoading = true;
       this.PostService.deletePost(postId).subscribe(() => {
            this.PostService.getPosts(this.postsPerPage,this.currentPage);
       });
    }
          

    ngOnDestroy(){
        this.postsSub?.unsubscribe();
    }
}