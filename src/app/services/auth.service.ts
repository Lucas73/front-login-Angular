import { JwtResponseI } from './../models/jwt-response';
import { UserI } from './../models/user';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable()
export class AuthService {
  AUTH_SERVER: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);
  private token: string;

  constructor(private httpClient: HttpClient) { }

  register(user: UserI): Observable<JwtResponseI>{
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}/register`, user).pipe(tap(
      (res: JwtResponseI)=>{
        if(res){
          this.saveToken(res.dataUser.accesToken, res.dataUser.expiresIn);
        }
      })
    )
  }
  login(user: UserI): Observable<JwtResponseI>{
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}/login`, user).pipe(tap(
      (res: JwtResponseI)=>{
        if(res){
          this.saveToken(res.dataUser.accesToken, res.dataUser.expiresIn);
        }
      })
    )
  }

  logout():void{
    this.token = '';
    localStorage.removeItem("ACCES_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
  }

  private saveToken(token:string, expiresIn: string): void{
    localStorage.setItem('ACCES_TOKEN', token);
    localStorage.setItem('EXPIRES_IN', expiresIn);
    this.token = token;
    }

  private getToken():string{
    if(!this.token){
      this.token = localStorage.getItem('ACCES_TOKEN');
    }
    return this.token;
  }

}
