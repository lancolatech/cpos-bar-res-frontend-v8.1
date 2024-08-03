import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import {
  AgeInterface,
  DateRangeInterface,
  TimeGroupType,
} from '../../interfaces/date-time.interface';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  constructor() {}

  dateRange = new BehaviorSubject<DateRangeInterface | null>(null);

  getFullDateToday(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear().toString();
    const formattedDate =
      year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
    return formattedDate;
  }

  getMonthsYearsAndDays(dateString: string): AgeInterface {
    let dob = new Date(dateString);
    let yearAge = 0;

    const isValidDate = this.isValidDate(dateString);

    //check user provide input or not
    if (!isValidDate.value) {
      return { years: 0, months: 0, days: 0, description: isValidDate.message };
    }
    //execute if the user entered a date
    else {
      //extract the year, month, and date from user date input
      var dobYear = Number(dob.getFullYear());
      var dobMonth = Number(dob.getMonth());
      var dobDate = Number(dob.getDate());

      //get the current date from the system
      var now = new Date();
      //extract the year, month, and date from current date
      var currentYear = now.getFullYear();
      var currentMonth = now.getMonth();
      var currentDate = now.getDate();
      var age: AgeInterface = { years: 0, months: 0, days: 0 };
      //get years
      yearAge = currentYear - dobYear;

      //get months
      if (currentMonth >= dobMonth)
        //get months when current month is greater
        var monthAge = currentMonth - dobMonth;
      else {
        yearAge--;
        var monthAge = 12 + currentMonth - dobMonth;
      }

      //get days
      if (currentDate >= dobDate)
        //get days when the current date is greater
        var dateAge = currentDate - dobDate;
      else {
        monthAge--;
        var dateAge = 31 + currentDate - dobDate;

        if (monthAge < 0) {
          monthAge = 11;
          yearAge--;
        }
      }
      //group the age in a single variable
      age = { years: yearAge, months: monthAge, days: dateAge };
      age.description = this.getFullAge(age);

      return age;
    }
  }

  getFullAge(age: AgeInterface): string {
    let ageString = 'Failed to get full age';
    if (age.years > 0 && age.months > 0 && age.days > 0)
      ageString =
        age.years +
        ' years, ' +
        age.months +
        ' months, and ' +
        age.days +
        ' days old.';
    else if (age.years == 0 && age.months == 0 && age.days > 0)
      ageString = 'Only ' + age.days + ' days old!';
    //when current month and date is same as birth date and month
    else if (age.years > 0 && age.months == 0 && age.days == 0)
      ageString = age.years + ' years old. Happy Birthday!!';
    else if (age.years > 0 && age.months > 0 && age.days == 0)
      ageString = age.years + ' years and ' + age.months + ' months old.';
    else if (age.years == 0 && age.months > 0 && age.days > 0)
      ageString = age.months + ' months and ' + age.days + ' days old.';
    else if (age.years > 0 && age.months == 0 && age.days > 0)
      ageString = age.years + ' years, and' + age.days + ' days old.';
    else if (age.years == 0 && age.months > 0 && age.days == 0)
      ageString = age.months + ' months old.';
    //when current date is same as dob(date of birth)
    else ageString = 'First day on Earth!';
    //display the calculated age
    return ageString;
  }

  getDaysAgo(age: AgeInterface): string {
    let ageString = 'Error, contact Maziwa tele';
    if (age.years > 0 && age.months > 0 && age.days > 0)
      ageString =
        age.years +
        ' years, ' +
        age.months +
        ' months, and ' +
        age.days +
        ' days ago.';
    else if (age.years == 0 && age.months == 0 && age.days > 0)
      ageString = age.days + ' days ago!';
    //when current month and date is same as birth date and month
    else if (age.years > 0 && age.months == 0 && age.days == 0)
      ageString = age.years + ' years ago.';
    else if (age.years > 0 && age.months > 0 && age.days == 0)
      ageString = age.years + ' years and ' + age.months + ' months ago.';
    else if (age.years == 0 && age.months > 0 && age.days > 0)
      ageString = age.months + ' months and ' + age.days + ' days ago.';
    else if (age.years > 0 && age.months == 0 && age.days > 0)
      ageString = age.years + ' years, and' + age.days + ' days ago.';
    else if (age.years == 0 && age.months > 0 && age.days == 0)
      ageString = age.months + ' months ago.';
    //when current date is same as dob(date of birth)
    else ageString = 'First day!';
    //display the calculated age
    return ageString;
  }

  isValidDate(dateString: string): { value: boolean; message: string } {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx))
      return { value: false, message: 'Invalid Date Format, use YYYY-MM-DD' }; // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0)
      return {
        value: false,
        message: 'Invalid Date, use accurate values for dates',
      }; // NaN value, Invalid date
    const isoString = d.toISOString().slice(0, 10) === dateString;
    if (!isoString) {
      return { value: false, message: 'Invalid Date' };
    }
    return { value: isoString, message: 'Valid' };
  }

  getTimeGroup(value?: string): TimeGroupType | 'N/A' {
    let time = '';
    if (!value) {
      const date = new Date();
      time = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else {
      time = value.trim();
    }

    if (time > '19:00') {
      return 'NIGHT';
    } else if (time >= '16:01' && time <= '19:00') {
      return 'EVENING';
    } else if (time >= '12:01' && time <= '16:00') {
      return 'AFTERNOON';
    } else if (time >= '09:01' && time <= '12:00') {
      return 'MID-DAY';
    } else if (time <= '09:00') {
      return 'MORNING';
    } else {
      return 'N/A';
    }
  }

  isToday(date?: string): boolean {
    if (!date) return false;
    const slicedDate = date.slice(0, 10);

    //get year, month and day from the date passed in
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const [inputYear, inputMonth, inputDay] = slicedDate.split('-').map(Number);

    const isToday =
      currentYear === inputYear &&
      currentMonth === inputMonth &&
      currentDay === inputDay;
    return isToday;
  }

  getDayOfTheWeek(day?: number): string {
    let d = day;
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    let currentDay = 0;
    if (day) {
      currentDay = new Date(day).getDay();
    } else {
      currentDay = new Date().getDay();
    }

    let dayOfTheWeek = weekday[currentDay];
    return dayOfTheWeek.toUpperCase();
  }

  getCurrentTime(timeString?: string): string {
    let time = new Date();
    if (timeString) {
      time = new Date(timeString);
    }
    const fullTime = time.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    return fullTime;
  }

  getMilisecondsTillMidnight(): number {
    // Create a new Date object and set it to today's date
    let today = new Date();

    // Set the time to 11:59pm
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(0);
    today.setMilliseconds(0);

    // Get the number of milliseconds since Unix Epoch for the specified date and time
    let milliseconds = today.getTime();
    return Number(milliseconds);
  }

  getTimeAgo(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Calculate the time difference in seconds

    if (diff < 60) {
      return diff + ' seconds ago';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return minutes + ' minutes ago';
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return hours + ' hours ago';
    } else if (diff < 2592000) {
      const days = Math.floor(diff / 86400);
      return days + ' days ago';
    } else if (diff < 31536000) {
      const months = Math.floor(diff / 2592000);
      return months + ' months ago';
    } else {
      const years = Math.floor(diff / 31536000);
      return years + ' years ago';
    }
  }
}
