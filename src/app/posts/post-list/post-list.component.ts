import { Component,Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs';
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";



@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

    posts: Post[] = [];
    private postsSub: Subscription | undefined;
    private authStatusSubs: Subscription;
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 3;
    pageSizeOptions = [1,2,5,10];
    currentPage = 1;
    userIsAuthenticated = false;



    constructor(private PostService:PostsService, private authService: AuthService){
        
    }

    ngOnInit() {
       this.isLoading = true;
       this.PostService.getPosts(this.postsPerPage,1);
        this.postsSub = this.PostService.getPostUpdateListener().subscribe((postData: {posts:Post[],postCount:number}) => {
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSubs = this.authService.getAuthListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
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
        this.postsSub.unsubscribe();
        this.authStatusSubs.unsubscribe();
    }
}