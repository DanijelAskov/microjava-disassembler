import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bytecode-reader-component',
  templateUrl: './bytecode-reader.component.html',
  styleUrls: ['./bytecode-reader.component.css']
})
export class BytecodeReaderComponent implements OnInit {

  private file: any;
  @Output("bytecode") private bytecodeEmitter: EventEmitter<ArrayBuffer> = new EventEmitter();
  private uploadedFileName: string = "simple_calculator.obj";
  folderOpenIcon: IconDefinition = faFolderOpen;

  constructor() { }

  ngOnInit() {
  }

  fileChanged(event: Event) {
    if ((event.target as HTMLInputElement).files.length > 0) {
      this.file = (event.target as HTMLInputElement).files[0];
      this.emitBytes();
    } else {
      this.bytecodeEmitter.emit(null);
      this.uploadedFileName = "";
    }
  }

  emitBytes() {
    let fileReader = new FileReader();
    fileReader.onload = event => this.bytecodeEmitter.emit(fileReader.result as ArrayBuffer);
    fileReader.readAsArrayBuffer(this.file);
    this.uploadedFileName = this.file.name;
  } 

}