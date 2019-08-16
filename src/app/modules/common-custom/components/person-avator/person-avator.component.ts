import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/service/request.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { LandingAuthorityService } from 'src/app/service/landing-authority.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-person-avator',
  templateUrl: './person-avator.component.html',
  styleUrls: ['./person-avator.component.scss']
})
export class PersonAvatorComponent implements OnInit {
  public userName = '';
  public avatarSrc = '';
  private authorityUrl: string;
  constructor(private request: RequestService, private router: Router, private nzMessage: NzMessageService,
    private landingAuthorityService: LandingAuthorityService) { }

  ngOnInit() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userName = userInfo && userInfo.userName;
    this.avatarSrc = userInfo && userInfo.userUrl;
  }


  logout() {
    // this.request.post('authentication/api/logout', {}).subscribe((result) => {
    //   this.router.navigate(['/login']).then(() => {
    //     this.nzMessage.success('退出成功');
    //     this.landingAuthorityService.clearInfoMessage();
    //   });
    // });

    this.landingAuthorityService.clearInfoMessage();
    location.href = `${environment['authorityUrl']}#/messageList`;
  }

}
