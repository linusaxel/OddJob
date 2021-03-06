import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { JobService } from "src/app/services/job.service";
import { LocationService } from "src/app/services/location.service";
import { Job } from "../../models/job";
import { Location } from "../../models/location";
import { User } from "src/app/models/user";
import axios from "axios";
import { Router } from '@angular/router';


@Component({
  selector: "post-job-form",
  templateUrl: "./post-job-form.component.html",
  styleUrls: ["./post-job-form.component.css"]
})
export class PostJobFormComponent implements OnInit {
  // -----------------Variable declarations------------------
  postJobForm: FormGroup;
  loading = false;
  submitted = false;
  incompleteAddress = true;

  newJob: Job;
  newLocation: Location;
  locationData: Location;

  street: string;
  zipCode: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  completeAddress: string;

  jobPic = 'https://res.cloudinary.com/linusaxel/image/upload/v1553348357/no-image-icon-6.png';
  @Input() user: User;

  options = {
    componentRestrictions: { country: 'se' }
  };

  // -----------------Constructor------------------
  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.postJobForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
    });

    this.user = JSON.parse(sessionStorage.getItem('authenticatedUser'));

    var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/linusaxel/upload';
    var CLOUDINARY_UPLOAD_PRESET = 'oddjob';

    var picture = document.getElementById('pic') as HTMLImageElement;
    var fileUpload = document.getElementById('file-upload');

    fileUpload.addEventListener('change', () => {
      let target = event.target as HTMLInputElement;
      let file = target.files[0];
      var formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      axios({
        url: CLOUDINARY_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: formData
      })
        .then(function (res) {
          console.log(res.data.secure_url);
          picture.src = res.data.secure_url;
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  }

  // --------Autocomplete address function -> assigning location vars values upon change in address field------------------
  handleAddressChange(event) {
    if (event.address_components.length === 5) {
      this.street = event.address_components[0].long_name;
      this.zipCode = null;
      this.city = event.address_components[2].long_name;
      this.country = event.address_components[4].long_name;
      this.lng = event.geometry.viewport.ga.j;
      this.lat = event.geometry.viewport.ma.j;
      this.completeAddress = event.formatted_address;
      document.getElementById('invalidAddress').style.display = 'none';
      document.getElementById('validAddress').style.display = 'inline-block';
      this.incompleteAddress = false;
    } else if (event.address_components.length === 7) {
      this.street = event.address_components[1].long_name + ' ' + event.address_components[0].long_name;
      this.zipCode = event.address_components[6].long_name;
      this.city = event.address_components[3].long_name;
      this.country = event.address_components[5].long_name;
      this.lng = event.geometry.viewport.ga.j;
      this.lat = event.geometry.viewport.ma.j;
      this.completeAddress = event.formatted_address;
      document.getElementById('invalidAddress').style.display = 'none';
      document.getElementById('validAddress').style.display = 'inline-block';
      this.incompleteAddress = false;
    } else {
      document.getElementById('invalidAddress').style.display = 'inline-block';
      document.getElementById('validAddress').style.display = 'none';
      this.incompleteAddress = true;
    }
  }

  get f() {
    return this.postJobForm.controls;
  }

  // -----------------On submit -> posting new location and job to db------------------
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.postJobForm.invalid || this.incompleteAddress) {
      console.log(this.postJobForm.invalid);
      console.log(this.incompleteAddress);
      console.log('Form not complete');
      return;
    }

    this.loading = true;

    this.locationData = new Location(
      null,
      this.street,
      this.zipCode,
      this.city,
      this.country,
      this.lat,
      this.lng
    );



    this.locationService.postLocation(this.locationData).subscribe(data => {
      this.locationService.getLocation(data.id).subscribe(loc => {
        this.newLocation = loc;
        this.newJob = new Job(
          null,
          this.postJobForm.controls['title'].value,
          this.postJobForm.controls['description'].value,
          this.newLocation,
          (document.getElementById('pic') as HTMLImageElement).src,
          this.user,
          this.postJobForm.controls['price'].value,
          new Date().toISOString().slice(0, 10)
          );
        this.jobService.postJob(this.newJob).subscribe(
          data => {
            alert('Job posted!');
            console.log(data);
            this.router.navigate(['jobs/' + data.id]);
          },
          error => {
            console.log(error);
          }
        );
      });
    });
  }
}
