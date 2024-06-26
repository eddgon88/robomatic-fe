import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TestModel } from '../../models/test-model';
import { NavigationTestService } from '../../services/navigation-test.service';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  theme = 'vs-dark';

  beforeScriptCodeModel: CodeModel = {
    language: 'python',
    uri: 'beforescript.py',
    value: ''
  };

  scriptCodeModel: CodeModel = {
    language: 'python',
    uri: 'main.py',
    value: ''
  };

  afterScriptCodeModel: CodeModel = {
    language: 'python',
    uri: 'afterscript.py',
    value: ''
  };

  casesCodeModel: CodeModel = {
    language: 'csv',
    uri: 'main.csv',
    value: ''
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  constructor(private testService: TestService,
              private notificationService: NotificationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private navigationTestService: NavigationTestService) { }

  test = new TestModel();
  folder!: number;
  path!: string;
  testId!: number;

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      console.log(url);
      this.path = url[0].path
      if (this.path === 'edit') this.testId = +url[1].path;
    })
    //this.activatedRoute.queryParams.subscribe(params => {
    //  this.folder = params['folderId'];
    //});
    this.folder = this.navigationTestService.folderId ? this.navigationTestService.folderId : 0;
    if (this.path === 'edit') {
      this.getTest();
    }

    console.log(this.folder);
  }

  onScriptCodeChanged(value: string): void {
    this.test.script = value;
  }

  onBeforeScriptCodeChanged(value: string): void {
    this.test.before_script = value;
  }

  onAfterScriptCodeChanged(value: string): void {
    this.test.after_script = value;
  }

  onTestCasesCodeChanged(value: string): void {
    this.test.test_cases = value;
  }

  create() {
    this.test.test_cases = btoa(this.test.test_cases);
    this.test.folder_id = this.folder;
    this.testService.create(this.test).subscribe(
      response => {
        this.notificationService.showSuccess("Test created successfully");
        this.router.navigate(['/test/home']);      
      }, (err) => {
        this.notificationService.showError("Error creating test")
        console.debug(err)
      })
  }

  getTest() {
    this.testService.getTest(this.testId).subscribe(
      response => {
        console.log(response);
        this.test = response;
        this.test.test_cases = atob(this.test.test_cases);
        this.updateCasesModelValue(this.test.test_cases);
        this.updateScriptModelValue(this.test.script);
        this.updateAfterScriptModelValue(this.test.after_script);
        this.updateBeforeScriptModelValue(this.test.before_script);
      }, err => {
        console.debug(err)
        this.notificationService.showError("Error getting test")
      }
    )
  }

  updateScriptModelValue(script: string) {
    var newModel = {
      language: 'python',
      uri: 'main.py',
      value: script
    };
    this.scriptCodeModel = JSON.parse(JSON.stringify(newModel));
  }

  updateBeforeScriptModelValue(script: string) {
    var newModel = {
      language: 'python',
      uri: 'beforescript.py',
      value: script
    };
    this.beforeScriptCodeModel = JSON.parse(JSON.stringify(newModel));
  }

  updateAfterScriptModelValue(script: string) {
    var newModel = {
      anguage: 'python',
      uri: 'afterscript.py',
      value: script
    };
    this.afterScriptCodeModel = JSON.parse(JSON.stringify(newModel));
  }

  updateCasesModelValue(cases: string) {
    var newModel = {
      language: 'csv',
      uri: 'main.csv',
      value: cases
    };
    this.casesCodeModel = JSON.parse(JSON.stringify(newModel));
  }

  update() {
    this.test.test_cases = btoa(this.test.test_cases);
    this.test.folder_id = this.folder;
    this.testService.update(this.test).subscribe(
      response => {
        this.notificationService.showSuccess("Test updated successfully");
        this.router.navigate(['/test/home']);      
      }, (err) => {
        this.notificationService.showError("Error updating test")
        console.debug(err)
      })
  }

}
