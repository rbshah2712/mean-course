import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment.development";
import { Post } from "./post.model";

const BACKHAND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const  queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(BACKHAND_URL + queryParams)
      .pipe(
        map(postData => {
          return { posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),maxPosts: postData.maxPosts};
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts],postCount:transformedPostsData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ 
      _id: string;
      title: string; 
      content: string; 
      imagePath: string;
      creator: string;
      }>(BACKHAND_URL + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        BACKHAND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKHAND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(BACKHAND_URL + postId);
      
  }
}
