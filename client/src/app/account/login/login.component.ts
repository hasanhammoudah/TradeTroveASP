import { AccountService } from './../account.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

loginForm = new FormGroup({
  email:new FormControl('',[Validators.required,Validators.email]),
  password:new FormControl('',Validators.required),
})
returnUrl:string;

constructor(private accountService:AccountService,private router:Router,private activedRoute:ActivatedRoute){
  this.returnUrl = this.activedRoute.snapshot.queryParams['returnUrl'] || '/shop'
}

onSubmit(){
 this.accountService.login(this.loginForm.value).subscribe({
  next:()=>this.router.navigateByUrl(this.returnUrl)
 })
}
}
