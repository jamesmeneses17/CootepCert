import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCertificadosComponent } from './historial-certificados.component';

describe('HistorialCertificadosComponent', () => {
  let component: HistorialCertificadosComponent;
  let fixture: ComponentFixture<HistorialCertificadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialCertificadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialCertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
