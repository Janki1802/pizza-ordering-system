import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaOrderingComponent } from './pizza-ordering.component';

describe('PizzaOrderingComponent', () => {
  let component: PizzaOrderingComponent;
  let fixture: ComponentFixture<PizzaOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaOrderingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PizzaOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
