import { Component, OnInit, Input } from "@angular/core";
import { JobService } from "../../services/job.service";
import { Job } from "../../models/job";

@Component({
  selector: "search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.css"]
})

export class SearchPageComponent implements OnInit {
  service: JobService;
  public jobs: Job[];
  @Input() userInput: string;
  userSearch: string;

  constructor(injectedService: JobService) {
    this.service = injectedService;
  }

  ngOnInit() {
    this.service.getJobs().subscribe(jobs => {
      this.jobs = jobs;
      console.log(jobs[1]);
    });
  }

  getUserSearch($event) {
    this.userSearch = $event;
  }

  aContainsB(a, b) {
    return a.toLowerCase().indexOf(b) >= 0;
  }
}
