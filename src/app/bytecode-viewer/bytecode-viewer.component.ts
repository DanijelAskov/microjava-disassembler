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

import { Component, OnInit, Input } from '@angular/core';
import { Disassembler } from '../shared/disassembler.shared';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faInfoCircle, faChartBar, faFile } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bytecode-viewer-component',
  templateUrl: './bytecode-viewer.component.html',
  styleUrls: ['./bytecode-viewer.component.css']
})
export class BytecodeViewerComponent implements OnInit {

  uint8Array: Uint8Array;
  charArray: string[] = [];
  disassembler: Disassembler;
  error: string;

  selectedIndex: number;
  entryPointIndex: number;
  destinationIndex: number;

  loading: boolean = false;

  exclamationIcon: IconDefinition = faExclamationCircle;
  infoIcon: IconDefinition = faInfoCircle;
  fileIcon: IconDefinition = faFile;
  barChartIcon: IconDefinition = faChartBar;

  firstSet: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  @Input("bytecode")
  set bytecodeToPreview(bytecode: ArrayBuffer) {
    if (!bytecode) {
      if (this.firstSet) {
        this.firstSet = false;
        this.uint8Array = new Uint8Array([77, 74, 0, 0, 4, 140, 0, 0, 0, 85, 0, 0, 1, 240, 51, 2, 2, 2, 3, 14, 0, 2, 52, 50, 51, 2, 2, 2, 3, 14, 0, 3, 52, 50, 51, 1, 1, 15, 52, 50, 57, 1, 51, 1, 1, 2, 2, 2, 40, 13, 0, 1, 16, 44, 0, 10, 39, 49, 0, 153, 42, 0, 112, 40, 13, 0, 1, 17, 44, 0, 10, 39, 49, 0, 154, 42, 0, 97, 40, 13, 0, 1, 18, 44, 0, 10, 39, 49, 0, 155, 42, 0, 82, 40, 13, 0, 1, 19, 44, 0, 10, 39, 49, 0, 156, 42, 0, 67, 13, 0, 0, 58, 0, 0, 0, 103, 0, 0, 0, 101, 0, 0, 0, 110, 0, 0, 0, 101, 0, 0, 0, 114, 0, 0, 0, 97, 0, 0, 0, 116, 0, 0, 0, 101, 0, 0, 0, 82, 0, 0, 0, 101, 0, 0, 0, 115, 0, 0, 0, 117, 0, 0, 0, 108, 0, 0, 0, 116, 255, 255, 255, 255, 14, 0, 4, 52, 50, 51, 1, 1, 2, 13, 0, 2, 52, 50, 57, 1, 51, 1, 1, 2, 13, 0, 3, 52, 50, 57, 1, 51, 1, 1, 2, 13, 0, 4, 52, 50, 57, 1, 51, 1, 1, 2, 13, 0, 2, 2, 13, 0, 3, 23, 52, 50, 57, 1, 51, 1, 1, 2, 13, 0, 2, 2, 13, 0, 3, 24, 52, 50, 57, 1, 51, 1, 1, 2, 13, 0, 2, 2, 13, 0, 3, 25, 52, 50, 57, 1, 51, 1, 1, 2, 13, 0, 2, 2, 13, 0, 3, 26, 52, 50, 57, 1, 51, 0, 9, 19, 10, 32, 0, 20, 40, 22, 0, 0, 0, 17, 14, 0, 0, 40, 16, 14, 0, 1, 6, 5, 32, 0, 20, 40, 22, 0, 0, 0, 34, 14, 0, 0, 40, 17, 14, 0, 1, 6, 6, 32, 0, 20, 40, 22, 0, 0, 0, 51, 14, 0, 0, 40, 18, 14, 0, 1, 6, 7, 32, 0, 20, 40, 22, 0, 0, 0, 68, 14, 0, 0, 40, 19, 14, 0, 1, 6, 8, 53, 7, 55, 9, 53, 8, 4, 22, 0, 0, 0, 43, 44, 0, 10, 1, 5, 6, 4, 42, 0, 48, 4, 22, 0, 0, 0, 45, 44, 0, 10, 1, 6, 6, 4, 42, 0, 32, 4, 22, 0, 0, 0, 42, 44, 0, 10, 1, 7, 6, 4, 42, 0, 16, 4, 22, 0, 0, 0, 47, 44, 0, 7, 1, 8, 6, 4, 1, 4, 2, 49, 254, 101, 1, 4, 3, 49, 254, 105, 1, 4, 49, 254, 118, 2, 16, 54, 22, 0, 0, 0, 32, 16, 56, 4, 16, 56, 22, 0, 0, 0, 32, 16, 56, 3, 16, 54, 22, 0, 0, 0, 32, 16, 56, 22, 0, 0, 0, 61, 16, 56, 22, 0, 0, 0, 32, 16, 56, 1, 4, 49, 254, 226, 16, 54, 22, 0, 0, 0, 10, 16, 56, 31, 3, 255, 5, 15, 46, 0, 6, 42, 255, 106, 52, 50, 51, 0, 0, 22, 0, 0, 0, 103, 12, 0, 0, 22, 0, 0, 0, 101, 12, 0, 1, 22, 0, 0, 0, 110, 12, 0, 2, 22, 0, 0, 0, 101, 12, 0, 3, 22, 0, 0, 0, 114, 12, 0, 4, 22, 0, 0, 0, 97, 12, 0, 5, 22, 0, 0, 0, 116, 12, 0, 6, 22, 0, 0, 0, 101, 12, 0, 7, 22, 0, 0, 0, 82, 12, 0, 8, 22, 0, 0, 0, 101, 12, 0, 9, 22, 0, 0, 0, 115, 12, 0, 10, 22, 0, 0, 0, 117, 12, 0, 11, 22, 0, 0, 0, 108, 12, 0, 12, 22, 0, 0, 0, 116, 12, 0, 13, 21, 12, 0, 14, 22, 0, 0, 0, 20, 12, 0, 15, 22, 255, 255, 255, 254, 12, 0, 16, 22, 0, 0, 0, 103, 12, 0, 17, 22, 0, 0, 0, 101, 12, 0, 18, 22, 0, 0, 0, 110, 12, 0, 19, 22, 0, 0, 0, 101, 12, 0, 20, 22, 0, 0, 0, 114, 12, 0, 21, 22, 0, 0, 0, 97, 12, 0, 22, 22, 0, 0, 0, 116, 12, 0, 23, 22, 0, 0, 0, 101, 12, 0, 24, 22, 0, 0, 0, 82, 12, 0, 25, 22, 0, 0, 0, 101, 12, 0, 26, 22, 0, 0, 0, 115, 12, 0, 27, 22, 0, 0, 0, 117, 12, 0, 28, 22, 0, 0, 0, 108, 12, 0, 29, 22, 0, 0, 0, 116, 12, 0, 30, 21, 12, 0, 31, 22, 0, 0, 0, 196, 12, 0, 32, 22, 255, 255, 255, 254, 12, 0, 33, 22, 0, 0, 0, 103, 12, 0, 34, 22, 0, 0, 0, 101, 12, 0, 35, 22, 0, 0, 0, 110, 12, 0, 36, 22, 0, 0, 0, 101, 12, 0, 37, 22, 0, 0, 0, 114, 12, 0, 38, 22, 0, 0, 0, 97, 12, 0, 39, 22, 0, 0, 0, 116, 12, 0, 40, 22, 0, 0, 0, 101, 12, 0, 41, 22, 0, 0, 0, 82, 12, 0, 42, 22, 0, 0, 0, 101, 12, 0, 43, 22, 0, 0, 0, 115, 12, 0, 44, 22, 0, 0, 0, 117, 12, 0, 45, 22, 0, 0, 0, 108, 12, 0, 46, 22, 0, 0, 0, 116, 12, 0, 47, 21, 12, 0, 48, 22, 0, 0, 0, 212, 12, 0, 49, 22, 255, 255, 255, 254, 12, 0, 50, 22, 0, 0, 0, 103, 12, 0, 51, 22, 0, 0, 0, 101, 12, 0, 52, 22, 0, 0, 0, 110, 12, 0, 53, 22, 0, 0, 0, 101, 12, 0, 54, 22, 0, 0, 0, 114, 12, 0, 55, 22, 0, 0, 0, 97, 12, 0, 56, 22, 0, 0, 0, 116, 12, 0, 57, 22, 0, 0, 0, 101, 12, 0, 58, 22, 0, 0, 0, 82, 12, 0, 59, 22, 0, 0, 0, 101, 12, 0, 60, 22, 0, 0, 0, 115, 12, 0, 61, 22, 0, 0, 0, 117, 12, 0, 62, 22, 0, 0, 0, 108, 12, 0, 63, 22, 0, 0, 0, 116, 12, 0, 64, 21, 12, 0, 65, 22, 0, 0, 0, 228, 12, 0, 66, 22, 255, 255, 255, 254, 12, 0, 67, 22, 0, 0, 0, 103, 12, 0, 68, 22, 0, 0, 0, 101, 12, 0, 69, 22, 0, 0, 0, 110, 12, 0, 70, 22, 0, 0, 0, 101, 12, 0, 71, 22, 0, 0, 0, 114, 12, 0, 72, 22, 0, 0, 0, 97, 12, 0, 73, 22, 0, 0, 0, 116, 12, 0, 74, 22, 0, 0, 0, 101, 12, 0, 75, 22, 0, 0, 0, 82, 12, 0, 76, 22, 0, 0, 0, 101, 12, 0, 77, 22, 0, 0, 0, 115, 12, 0, 78, 22, 0, 0, 0, 117, 12, 0, 79, 22, 0, 0, 0, 108, 12, 0, 80, 22, 0, 0, 0, 116, 12, 0, 81, 21, 12, 0, 82, 22, 0, 0, 0, 244, 12, 0, 83, 22, 255, 255, 255, 254, 12, 0, 84, 49, 252, 125, 52, 50]);
      } else {
        this.error = new Error("No file selected.").toString();
        this.disassembler = null;
        return;
      }
    } else {
      this.uint8Array = new Uint8Array(bytecode);
    }
    this.error = null;
    this.loading = true;
    this.selectedIndex = this.entryPointIndex = this.destinationIndex = null;
    setTimeout(() => {
      this.disassembler = new Disassembler(this.uint8Array);
      try {
        this.disassembler.disassemble();
        for (let i = 0; i < this.disassembler.disassembledInstructions.length; i++) {
          if (this.disassembler.disassembledInstructions[i].address === this.disassembler.getEntryPoint()) {
            this.entryPointIndex = i;
            break;
          }
        }
      } catch (e) {
        this.error = e;
      }
      this.loading = false;
    }, 1000);
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  selectDestination(address: number) {
    for (let i = 0; i < this.disassembler.disassembledInstructions.length; i++) {
      if (this.disassembler.disassembledInstructions[i].address === address) {
        this.destinationIndex = i;
        break;
      }
    }
  }

  unselectDestination() {
    this.destinationIndex = null;
  }

}