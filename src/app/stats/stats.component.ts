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
import { Disassembler, Instruction } from '../shared/disassembler.shared';

@Component({
  selector: 'stats-component',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input("loading") public loading: boolean = false;

  public numInstructions: number = 0;
  public averageInstructionLength: number = 0;
  public numSubroutines: number = 0;
  public averageJumpOffset: number = 0;
  private numJumpInstructions: number = 0;
  private instructionCount = {};
  public instructionCountArray = [];

  public totalNumInstructions = Disassembler.INSTRUCTIONS.length;
  public leftOutInstructions: Instruction[] = [];

  constructor() { }

  ngOnInit() {
  }

  @Input("disassembler")
  set disassembler(disassembler: Disassembler) {
    if (!disassembler)
      return;

    this.numInstructions = 0;
    this.averageInstructionLength = 0;
    this.numSubroutines = 0;
    this.averageJumpOffset = 0;
    this.numJumpInstructions = 0;
    this.instructionCount = {};
    this.instructionCountArray = [];
    this.leftOutInstructions = Object.assign([], Disassembler.INSTRUCTIONS);
    
    disassembler.disassembledInstructions.forEach(disassembledInstruction => {
      if (disassembledInstruction.instruction !== Disassembler.INVALID_INSTR) {
        this.numInstructions++;
        this.averageInstructionLength += disassembledInstruction.bytes.length;
        if (disassembledInstruction.instruction == Disassembler.RETURN)
          this.numSubroutines++;
        else if (disassembledInstruction.instruction.opcode >= Disassembler.JMP.opcode && disassembledInstruction.instruction.opcode <= Disassembler.JGE.opcode && !disassembledInstruction.warning) {
          this.averageJumpOffset += disassembledInstruction.referencedAddress - disassembledInstruction.address;
          this.numJumpInstructions++;
        }
        let mnemonic = disassembledInstruction.instruction.mnemonic;
        if (!(mnemonic in this.instructionCount))
          this.instructionCount[mnemonic] = 0;
        this.instructionCount[mnemonic]++;
      }
    });
    this.averageInstructionLength /= this.numInstructions;
    this.averageJumpOffset = this.numJumpInstructions ? this.averageJumpOffset / this.numJumpInstructions : 0;

    for (let key in this.instructionCount){
      this.instructionCountArray.push({
        mnemonic: key,
        count: this.instructionCount[key]
      });
      this.leftOutInstructions.splice(this.leftOutInstructions.findIndex((instruction) => {
        return instruction.mnemonic === key;
      }), 1);
    }
    this.instructionCountArray.sort((ic1, ic2) => {
      return ic2.count - ic1.count;
    });
  }

}
