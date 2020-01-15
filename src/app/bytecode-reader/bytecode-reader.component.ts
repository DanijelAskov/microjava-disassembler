/*
 * Copyright (C) 2020  Danijel Askov
 *
 * This file is part of MicroJava Disassembler.
 *
 * MicroJava Disassembler is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MicroJava Disassembler is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
  @Output("bytecode") public bytecodeEmitter: EventEmitter<ArrayBuffer> = new EventEmitter();
  public uploadedFileName: string = "simple_calculator.obj";
  public folderOpenIcon: IconDefinition = faFolderOpen;

  constructor() { }

  ngOnInit() {
  }

  fileChanged(event: Event) {
    let eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files.length > 0) {
      this.file = eventTarget.files[0];
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