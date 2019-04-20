import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { visibility, flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  feedbackErrMsg: string;
  success = false;
  submitted = false;
  returnedFeedback: Feedback;
  visibility = 'shown';

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  }

  validationMessages = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters',
      'maxlength': 'First name cannot be more than 25 characters',
    },
    'lastname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters',
      'maxlength': 'First name cannot be more than 25 characters',
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must conatins only numbers.',
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in the valid format.',
    }
  };

  constructor(private fb: FormBuilder,
    private feedbackservice: FeedbackService,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
    this.submitted = false;
   }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.returnedFeedback = this.feedbackForm.value;
    this.submitted = false;
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now 
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.feedback = this.feedbackForm.value;
    //submit the feedback
    this.feedbackservice.submitFeedback(this.feedback)
      .subscribe(returnedFeedback  => {
        this.returnedFeedback = returnedFeedback;
        this.success = true;
        this.submitted = false;
        this.visibility = 'shown';  
        setTimeout(() => {
          this.success = false;
          this.returnedFeedback = null;
          this.createForm();
        }, 5000);
      },
        feedbackErrMsg => {
          this.feedback = null; this.feedbackErrMsg = <any>feedbackErrMsg;
        });

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });
  }
}
