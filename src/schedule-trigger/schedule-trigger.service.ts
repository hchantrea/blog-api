import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduleTriggerService {

  // everyday at the 00:00 midnight
  @Cron('0 0 0 * * *')
  handleEveryday() {
    console.log("hello world");
  }

  // every 1st of the month
  @Cron('0 0 12 1 * *')
  handleEveryFirstDayOfTheMonth() {
    console.log("hello world");
  }
}
