import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './users/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
}
