import { Component, OnInit, Input } from '@angular/core';
import { Disassembler } from '../shared/disassembler.shared';

@Component({
  selector: 'stats-component',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input("loading") private loading: boolean = false;

  private numInstructions: number = 0;
  private averageInstructionLength: number = 0;
  private numSubroutines: number = 0;
  private averageJumpOffset: number = 0;
  private numJumpInstructions: number = 0;
  private instructionCount = {};
  private instructionCountArray = [];

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
    
    this.numInstructions = disassembler.disassembledInstructions.length;
    disassembler.disassembledInstructions.forEach(disassembledInstruction => {
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
    });
    this.averageInstructionLength /= this.numInstructions;
    this.averageJumpOffset /= this.numJumpInstructions;

    for (let key in this.instructionCount){
      this.instructionCountArray.push({
        mnemonic: key,
        count: this.instructionCount[key]
      });
    }
    this.instructionCountArray.sort((ic1, ic2) => {
      return ic2.count - ic1.count;
    });
  }

}
