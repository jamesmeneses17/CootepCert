import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dato-usuario',
  imports: [],
  templateUrl: './dato-usuario.component.html',
  styleUrl: './dato-usuario.component.css'
})
export class DatoUsuarioComponent {
  @Input() label: string = '';
  @Input() value: string = '';

}
