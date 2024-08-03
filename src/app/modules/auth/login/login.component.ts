import { OrganizationService } from 'src/app/shared/services/organization/organization.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  OrgOptionsInterface,
  OrganizationInterface,
} from 'src/app/shared/interfaces/organization.interface';
import { takeUntil, Subject } from 'rxjs';
import { landingPage } from 'src/app/shared/data/landing-page.data';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from '../../admin/services/admin.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';
import { ShiftService } from '../../admin/services/shift.service';
import { error } from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  organization: OrganizationInterface | null = null;
  currentYear: number = new Date().getFullYear();
  savedOrg: any;
  orgOptions: OrgOptionsInterface | null = null;

  // form: FormGroup = new FormGroup({
  //   email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
  //   password: new FormControl<string | null>(null, [Validators.required]),
  // })

  // login() {
  //   this.authService.login(this.form.value);
  // }

  loginForm: FormGroup = new FormGroup({
    pin: new FormControl('', Validators.required),
  });

  // constructor(private fb: FormBuilder, private http: HttpClient) { }

  pinDigits: string[] = ['', '', '', ''];
  //pins to authenticate
  currentOrganization: OrganizationInterface | null = null;
  CurrentOrgName: any;
  dayLeft: any;
  expiry_date: any;
  interval: any;
  timeLeft: any = {};

  pinValues: string[] = [];
  constructor(
    private fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private organizationService: OrganizationService,
    private toast: HotToastService,
    private shiftService: ShiftService,
    private adminService: AdminService
  ) {
    // this.fetchOrganizationInfo();
  }

  ngOnInit(): void {
    this.organizationService.organization$.subscribe(
      (organization: OrganizationInterface | null) => {
        this.currentOrganization = organization;

        this.CurrentOrgName = this.currentOrganization?.name;
        this.dayLeft = this.currentOrganization?.daysLeft;
        this.expiry_date = this.currentOrganization?.expiry_date;
        console.log('Expiry date', this.expiry_date);
      }
    );

    this.interval = setInterval(() => {
      this.calculateTimeLeft();
    }, 1000);

    this.loginForm = this.fb.group({
      pin: ['', Validators.required],
    });
    // this.fetchOrganizationInfo();
  }
  private fetchOrganizationInfo() {
    this.adminService.orgOptions$.subscribe((orgOptions) => {
      this.orgOptions = orgOptions;
      console.log({ orgOptions });
      this.startShiftOnLogin();

      if (!this.orgOptions) {
        console.error('companyInfo is invalid or does not have an id property');
        return;
      }
    });

    // this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}`;
    // console.log('api url link', this.apiUrl);
  }
  startShiftOnLogin() {
    console.log('does org has shift?', this.orgOptions);
    if (this.orgOptions!.has_shifts === false) {
      this.shiftService.startShiftOnLogin().subscribe((res) => {
        console.log('shift created on login', res);
      });
    }
  }

  private calculateTimeLeft(): void {
    const now = new Date().getTime();
    const expiryTime = new Date(this.expiry_date).getTime();
    const difference = expiryTime - now;

    if (difference > 0) {
      this.timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    } else {
      // Set timeLeft to 0 when expiry date is past
      this.timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      clearInterval(this.interval);
    }
  }

  subScriptionExpired() {
    this.toast.error(
      'Your subscription has expired. Please contact your administrator.'
    );
  }

  onSubmit() {
    // const pinValue = this.loginForm.get('pin')?.value;
    // if (pinValue) {
    //   const apiUrl = 'https://example.com/your-external-endpoint'; // Replace with the actual endpoint URL
    //   const requestBody = { pin: pinValue }; // Modify this to match the expected request format of your external backend
    //   this.http.post(apiUrl, requestBody).subscribe(
    //     (response) => {
    //       // Handle the response from the external backend here
    //       console.log('Response from external backend:', response);
    //     },
    //     (error) => {
    //       // Handle any errors that occur during the HTTP request
    //       console.error('Error:', error);
    //     }
    //   );
    // }
  }

  getCurrentOrganization() {
    this.organizationService.organization$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.organization = data;
        },
        error: (err) => {},
      });
  }

  addNumber(number: number) {
    if (
      this.timeLeft.days == 0 &&
      this.timeLeft.hours == 0 &&
      this.timeLeft.minutes == 0 &&
      this.timeLeft.seconds == 0
    ) {
      console.log('days left ', this.timeLeft.days);
      this.subScriptionExpired();
      return;
    }
    const pinDigits = this.pinDigits;
    // Find the first empty slot in the array and add the number
    for (let i = 0; i < pinDigits.length; i++) {
      if (pinDigits[i] === '') {
        pinDigits[i] = number.toString();
        this.pinAuthenticateUser(pinDigits[i]);
        break;
      }
    }
    // Update the form control with the new PIN
    this.loginForm.get('pin')?.setValue(pinDigits.join(''));
  }
  showSpinner(): void {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
      this.pinDigits = ['', '', '', ''];
      this.pinValues = [];
    }, 5000); // 5 seconds
  }

  // To set range of numbers from 1 to 9
  range(count: number): number[] {
    const numbers = Array(count)
      .fill(1)
      .map((x, i) => i)
      .filter((n) => n !== 0);
    return numbers;
  }

  // To mask the input when a number is entered and display it as dots or asterisks (e.g., "••••"),
  maskPin(pin: string): string {
    return '•'.repeat(pin.length);
  }
  // authenticate user
  pinAuthenticateUser(pin: string) {
    // const token = localStorage.getItem('jwttoken');
    if (this.pinValues.length > 3) return;
    this.pinValues.push(pin);
    if (this.pinValues.length) {
      const str = this.pinValues.toString().split(',').join('');

      if (str.length < 4) return;

      this.showSpinner();
      this.authService.pinAuthentication(str).then(
        (res) => {
          console.log(res);
          this.fetchOrganizationInfo();
          // this.toast.success('you mansges to login');
          // this.router.navigate([landingPage]);
        },
        (error) => {
          this.pinValues = [];
          this.pinDigits = ['', '', '', ''];
        }
      );
    }
  }

  backspace() {
    const pinDigits = this.pinDigits;

    // Find the last non-empty slot and clear it
    for (let i = pinDigits.length - 1; i >= 0; i--) {
      if (pinDigits[i] !== '') {
        pinDigits[i] = '';
        this.pinValues.splice(i, 1);
        break;
      }
    }
    // Update the form control with the new PIN
    this.loginForm.get('pin')?.setValue(pinDigits.join(''));
  }

  delete() {
    const pinDigits = this.loginForm.get('pin') as FormControl;

    // Clear the input value
    pinDigits.setValue('');
  }

  // on destroy
  destroy$ = new Subject();
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
