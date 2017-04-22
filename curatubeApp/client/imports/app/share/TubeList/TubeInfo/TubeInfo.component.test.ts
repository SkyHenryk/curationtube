// chai uses as asset library
import {assert} from "chai";

// Angular 2 tests imports
import {TestBed, TestModuleMetadata} from "@angular/core/testing";

// Project imports
import {TubeComponent} from "./TubeInfo.component";
import {Tube} from "../../../../both/models/tube.model";
import {TubeDataService} from "../TubeData.service";
import {Observable, BehaviorSubject} from "rxjs";

describe("TubeComponent", () => {
  let tubeComponentInstance: TubeComponent;
  let tubeComponentElement;
  let componentFixture;

  let mockData = new BehaviorSubject([]);
  mockData.next([
    <Tube>{
      name: "Test",
      age: 10
    }
  ]);

  let mockDataService = {
    getData: () => mockData
  };

  beforeEach(() => {
    TestBed.configureTestingModule(<TestModuleMetadata>{
      declarations: [TubeComponent],
      providers: [
        {provide: TubeDataService, useValue: mockDataService}
      ]
    });

    componentFixture = TestBed.createComponent(TubeComponent);
    tubeComponentInstance = componentFixture.componentInstance;
    tubeComponentElement = componentFixture.debugElement;
  });

  describe("@Component instance", () => {
    it("Should have a greeting string on the component", () => {
      assert.typeOf(tubeComponentInstance.greeting, "string", "Greeting should be a string!");
    });

    it("Should say hello to the component on the greeting string", () => {
      assert.equal(tubeComponentInstance.greeting, "Hello Tube Component!");
    });

    it("Should have an Observable (from the mock) of the instance", () => {
      tubeComponentInstance.ngOnInit();
      assert.isTrue(tubeComponentInstance.data instanceof Observable);
    });

    it("Should have an items in the Observable", (done) => {
      tubeComponentInstance.ngOnInit();
      assert.isTrue(tubeComponentInstance.data instanceof Observable);

      tubeComponentInstance.data.subscribe((data) => {
        assert.equal(data.length, 1);
        assert.typeOf(data, "array");

        done();
      });
    });
  });

  describe("@Component view", () => {
    it("Should print the greeting to the screen", () => {
      componentFixture.detectChanges();
      assert.include(tubeComponentElement.nativeElement.innerHTML, "Hello Tube Component");
    });

    it("Should change the greeting when it changes", () => {
      componentFixture.detectChanges();
      assert.include(tubeComponentElement.nativeElement.innerHTML, "Hello Tube Component");
      tubeComponentInstance.greeting = "New Test Greeting";
      componentFixture.detectChanges();
      assert.include(tubeComponentElement.nativeElement.innerHTML, "New Test Greeting");
    });

    it("Should display a list of items in the screen", () => {
      componentFixture.detectChanges();
      assert.isNotNull(tubeComponentElement.nativeElement.querySelector("ul"));
    });
  });
});
