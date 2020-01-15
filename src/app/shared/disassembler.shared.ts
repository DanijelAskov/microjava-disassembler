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

class Instruction {
  public readonly opcode: number;
  public readonly mnemonic: string;
}

class DisassembledInstruction {
  public address: number;

  public instruction: Instruction;
  public operands: string;

  public referencedAddress: number;
  public warning: string;

  public bytes: Uint8Array;

  constructor(address: number, instruction: Instruction, operands: string, referencedAddress: number, warning: string, bytes: Uint8Array) {
    this.address = address;

    this.instruction = instruction;
    this.operands = operands;

    this.referencedAddress = referencedAddress;
    this.warning = warning;

    this.bytes = bytes;
  }

  toString() {
    return this.operands ? this.instruction.mnemonic + ' ' + this.operands : this.instruction.mnemonic;
  }
}

export class Disassembler {

  uint8Array: Uint8Array;
  current: number = 0;
  address: number = 0;
  headerSize: number = 0;
  public disassembledInstructions: DisassembledInstruction[];

  opcode: number;
  operand1: number;
  operand2: number;

  codeSize: number;
  dataSize: number;
  entryPoint: number;

  jumpDestination: number;
  warning: string;

  public static readonly MIN_OBJ_SIZE: number = 1 + 1 + 3 * 4 + 1;
  
  public static readonly LOAD: Instruction = {mnemonic: "load", opcode: 1};
  public static readonly LOAD_0: Instruction = {mnemonic: "load_0", opcode: 2};
  public static readonly LOAD_1: Instruction = {mnemonic: "load_1", opcode: 3};
  public static readonly LOAD_2: Instruction = {mnemonic: "load_2", opcode: 4};
  public static readonly LOAD_3: Instruction = {mnemonic: "load_3", opcode: 5};

  public static readonly STORE: Instruction = {mnemonic: "store", opcode: 6};
  public static readonly STORE_0: Instruction = {mnemonic: "store_0", opcode: 7};
  public static readonly STORE_1: Instruction = {mnemonic: "store_1", opcode: 8};
  public static readonly STORE_2: Instruction = {mnemonic: "store_2", opcode: 9};
  public static readonly STORE_3: Instruction = {mnemonic: "store_3", opcode: 10};

  public static readonly GETSTATIC: Instruction = {mnemonic: "getstatic", opcode: 11};
  public static readonly PUTSTATIC: Instruction = {mnemonic: "putstatic", opcode: 12};

  public static readonly GETFIELD: Instruction = {mnemonic: "getfield", opcode: 13};
  public static readonly PUTFIELD: Instruction = {mnemonic: "putfield", opcode: 14};

  public static readonly CONST_0: Instruction = {mnemonic: "const_0", opcode: 15};
  public static readonly CONST_1: Instruction = {mnemonic: "const_1", opcode: 16};
  public static readonly CONST_2: Instruction = {mnemonic: "const_2", opcode: 17};
  public static readonly CONST_3: Instruction = {mnemonic: "const_3", opcode: 18};
  public static readonly CONST_4: Instruction = {mnemonic: "const_4", opcode: 19};
  public static readonly CONST_5: Instruction = {mnemonic: "const_5", opcode: 20};
  public static readonly CONST_M1: Instruction = {mnemonic: "const_m1", opcode: 21};
  public static readonly CONST: Instruction = {mnemonic: "const", opcode: 22};

  public static readonly ADD: Instruction = {mnemonic: "add", opcode: 23};
  public static readonly SUB: Instruction = {mnemonic: "sub", opcode: 24};
  public static readonly MUL: Instruction = {mnemonic: "mul", opcode: 25};
  public static readonly DIV: Instruction = {mnemonic: "div", opcode: 26};
  public static readonly REM: Instruction = {mnemonic: "rem", opcode: 27};
  public static readonly NEG: Instruction = {mnemonic: "neg", opcode: 28};

  public static readonly SHL: Instruction = {mnemonic: "shl", opcode: 29};
  public static readonly SHR: Instruction = {mnemonic: "shr", opcode: 30};

  public static readonly INC: Instruction = {mnemonic: "inc", opcode: 31};

  public static readonly NEW: Instruction = {mnemonic: "new", opcode: 32};
  public static readonly NEWARRAY: Instruction = {mnemonic: "newarray", opcode: 33};

  public static readonly ALOAD: Instruction = {mnemonic: "aload", opcode: 34};
  public static readonly ASTORE: Instruction = {mnemonic: "astore", opcode: 35};
  public static readonly BALOAD: Instruction = {mnemonic: "baload", opcode: 36};
  public static readonly BASTORE: Instruction = {mnemonic: "bastore", opcode: 37};
  
  public static readonly ARRAYLENGTH: Instruction = {mnemonic: "arraylength", opcode: 38};

  public static readonly POP: Instruction = {mnemonic: "pop", opcode: 39};
  public static readonly DUP: Instruction = {mnemonic: "dup_x1", opcode: 40};
  public static readonly DUP2: Instruction = {mnemonic: "dup_x2", opcode: 41};

  public static readonly JMP: Instruction = {mnemonic: "jmp", opcode: 42};
  public static readonly JEQ: Instruction = {mnemonic: "jeq", opcode: 43};
  public static readonly JNE: Instruction = {mnemonic: "jne", opcode: 44};
  public static readonly JLT: Instruction = {mnemonic: "jlt", opcode: 45};
  public static readonly JLE: Instruction = {mnemonic: "jle", opcode: 46};
  public static readonly JGT: Instruction = {mnemonic: "jgt", opcode: 47};
  public static readonly JGE: Instruction = {mnemonic: "jge", opcode: 48};

  public static readonly CALL: Instruction = {mnemonic: "call", opcode: 49};
  public static readonly RETURN: Instruction = {mnemonic: "return", opcode: 50};
  public static readonly ENTER: Instruction = {mnemonic: "enter", opcode: 51};
  public static readonly EXIT: Instruction = {mnemonic: "exit", opcode: 52};

  public static readonly READ: Instruction = {mnemonic: "read", opcode: 53};
  public static readonly PRINT: Instruction = {mnemonic: "print", opcode: 54};
  public static readonly BREAD: Instruction = {mnemonic: "bread", opcode: 55};
  public static readonly BPRINT: Instruction = {mnemonic: "bprint", opcode: 56};

  public static readonly TRAP: Instruction = {mnemonic: "trap", opcode: 57};

  public static readonly INVOKEVIRTUAL: Instruction = {mnemonic: "invokevirtual", opcode: 58};

  public static readonly DUP_X1: Instruction = {mnemonic: "dup_x1", opcode: 59};
  public static readonly DUP_X2: Instruction = {mnemonic: "dup_x2", opcode: 60};

  public static readonly INSTRUCTIONS: Instruction[] = [
    Disassembler.LOAD, Disassembler.LOAD_0, Disassembler.LOAD_1, Disassembler.LOAD_2,
    Disassembler.LOAD_3, Disassembler.STORE, Disassembler.STORE_0, Disassembler.STORE_1,
    Disassembler.STORE_2, Disassembler.STORE_3, Disassembler.GETSTATIC, Disassembler.PUTSTATIC,
    Disassembler.GETFIELD, Disassembler.PUTFIELD, Disassembler.CONST_0, Disassembler.CONST_1,
    Disassembler.CONST_2, Disassembler.CONST_3, Disassembler.CONST_4, Disassembler.CONST_5,
    Disassembler.CONST_M1, Disassembler.CONST, Disassembler.ADD, Disassembler.SUB,
    Disassembler.MUL, Disassembler.DIV, Disassembler.REM, Disassembler.NEG,
    Disassembler.SHL, Disassembler.SHR, Disassembler.INC, Disassembler.NEW,
    Disassembler.NEWARRAY, Disassembler.ALOAD, Disassembler.ASTORE, Disassembler.BALOAD,
    Disassembler.BASTORE, Disassembler.ARRAYLENGTH, Disassembler.POP, Disassembler.DUP,
    Disassembler.DUP2, Disassembler.JMP, Disassembler.JEQ, Disassembler.JNE,
    Disassembler.JLT, Disassembler.JLE, Disassembler.JGT, Disassembler.JGE,
    Disassembler.CALL, Disassembler.RETURN, Disassembler.ENTER, Disassembler.EXIT,
    Disassembler.READ, Disassembler.PRINT, Disassembler.BREAD, Disassembler.BPRINT,
    Disassembler.TRAP, Disassembler.INVOKEVIRTUAL, Disassembler.DUP_X1, Disassembler.DUP_X2
  ];

  private startAddresses: number[];

  constructor(uint8Array: Uint8Array) {
    this.uint8Array = uint8Array;
    this.disassembledInstructions = [];
  }

  get() {
    return this.uint8Array[this.current++] & 0x0ff;
  }

  get2() {
    return (this.get() << 8 | this.get()) & 0x0ffff;
  }
	
  get4() {
    return (this.get2() << 16 | this.get2());
  }

  jumpOffset() {
		let displacement = this.operand1 = this.get2();
    displacement = displacement << 16 >> 16;
		this.jumpDestination = this.address + displacement;
		return displacement + ' (dest: ' + this.jumpDestination + ')';
  }

  put(instruction: Instruction, bytes: Uint8Array, operands: string = null, isJumpInstruction: boolean = false) {
    if (this.jumpDestination && (this.jumpDestination < 0 || this.jumpDestination >= this.uint8Array.length - this.headerSize)) {
      this.warning = 'This instruction is problematic! Destination address does not exist.';
    }
    this.disassembledInstructions.push(new DisassembledInstruction(this.address, instruction, operands, isJumpInstruction ? this.jumpDestination : null, this.warning, bytes));
    this.address = this.current - this.headerSize;
  }

  disassemble() {
    if (this.uint8Array.length < Disassembler.MIN_OBJ_SIZE)
      throw new Error("The file is too small!");
    else if (String.fromCharCode(this.get()) != 'M' || String.fromCharCode(this.get()) != 'J')
      throw new Error("The file has invalid header!");
    
    this.codeSize = this.get4();
    this.dataSize = this.get4();
    this.entryPoint = this.get4();
    
    this.headerSize = this.current;
    this.address = this.current - this.headerSize;

    this.startAddresses = [];
    
    while (this.current < this.uint8Array.length) {
      this.warning = null;
      this.jumpDestination = null;
      this.startAddresses.push(this.address);
      switch(this.opcode = this.get()) {
				case Disassembler.LOAD.opcode: {
          this.operand1 = this.get();
          this.put(Disassembler.LOAD, new Uint8Array([this.opcode, this.operand1]), this.operand1.toString());
          break;
        }
				case Disassembler.LOAD_0.opcode: {
          this.put(Disassembler.LOAD_0, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.LOAD_1.opcode: {
          this.put(Disassembler.LOAD_1, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.LOAD_2.opcode: {
          this.put(Disassembler.LOAD_2, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.LOAD_3.opcode: {
          this.put(Disassembler.LOAD_3, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.STORE.opcode: {
          this.operand1 = this.get();
          this.put(Disassembler.STORE, new Uint8Array([this.opcode, this.operand1]), this.operand1.toString());
          break;
        }
				case Disassembler.STORE_0.opcode: {
          this.put(Disassembler.STORE_0, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.STORE_1.opcode: {
          this.put(Disassembler.STORE_1, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.STORE_2.opcode: {
          this.put(Disassembler.STORE_2, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.STORE_3.opcode: {
          this.put(Disassembler.STORE_3, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.GETSTATIC.opcode: {
          this.operand1 = this.get2();
          this.put(Disassembler.GETSTATIC, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), this.operand1.toString());
          break;
        }
				case Disassembler.PUTSTATIC.opcode: {
          this.operand1 = this.get2();
          this.put(Disassembler.PUTSTATIC, new Uint8Array([this.opcode,(this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), this.operand1.toString());
          break;
        }
				case Disassembler.GETFIELD.opcode: {
          this.operand1 = this.get2();
          this.put(Disassembler.GETFIELD, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), this.operand1.toString()); 
          break;
        }
				case Disassembler.PUTFIELD.opcode: {
          this.operand1 = this.get2();
          this.put(Disassembler.PUTFIELD, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), this.operand1.toString());
          break;
        }
				case Disassembler.CONST_0.opcode: {
          this.put(Disassembler.CONST_0, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.CONST_1.opcode: {
          this.put(Disassembler.CONST_1, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.CONST_2.opcode: {
          this.put(Disassembler.CONST_2, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.CONST_3.opcode: {
          this.put(Disassembler.CONST_3, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.CONST_4.opcode: {
          this.put(Disassembler.CONST_4, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.CONST_5.opcode: {
          this.put(Disassembler.CONST_5, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.CONST_M1.opcode: {
          this.put(Disassembler.CONST_M1, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.CONST.opcode: {
          this.operand1 = this.get4();
          let asciiChar = String.fromCharCode(this.operand1);
          let isPrintable = /^[ -~]$/.test(asciiChar);
          this.put(Disassembler.CONST, new Uint8Array([this.opcode, (this.operand1 >> 24) & 0x0ff, (this.operand1 >> 16) & 0x0ff, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), this.operand1.toString() + (isPrintable ? " (ASCII char: '" + asciiChar + "')" : ""));
          break;
        }
				case Disassembler.ADD.opcode: {
          this.put(Disassembler.ADD, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.SUB.opcode: {
          this.put(Disassembler.SUB, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.MUL.opcode: {
          this.put(Disassembler.MUL, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.DIV.opcode: {
          this.put(Disassembler.DIV, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.REM.opcode: {
          this.put(Disassembler.REM, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.NEG.opcode: {
          this.put(Disassembler.NEG, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.SHL.opcode: {
          this.put(Disassembler.SHL, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.SHR.opcode: {
          this.put(Disassembler.SHR, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.INC.opcode: {
          this.operand1 = this.get();
          this.operand2 = this.get();
          this.put(Disassembler.INC, new Uint8Array([this.opcode, this.operand1, this.operand2]), this.operand1 + ', ' + (this.operand2 << 24 >> 24));
          break;
        }
				case Disassembler.NEW.opcode: {
          this.operand1 = this.get2();
          this.put(Disassembler.NEW, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), this.operand1.toString());
          break;
        }
				case Disassembler.NEWARRAY.opcode: {
          this.operand1 = this.get();
          this.put(Disassembler.NEWARRAY, new Uint8Array([this.opcode, this.operand1]), this.operand1.toString());
          break;
        }
				case Disassembler.ALOAD.opcode: {
          this.put(Disassembler.ALOAD, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.ASTORE.opcode: {
          this.put(Disassembler.ASTORE, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.BALOAD.opcode: {
          this.put(Disassembler.BALOAD, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.BASTORE.opcode: {
          this.put(Disassembler.BASTORE, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.ARRAYLENGTH.opcode: {
          this.put(Disassembler.ARRAYLENGTH, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.POP.opcode: {
          this.put(Disassembler.POP, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.DUP.opcode: {
          this.put(Disassembler.DUP, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.DUP2.opcode: {
          this.put(Disassembler.DUP2, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.JMP.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.JMP, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.JEQ.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.JEQ, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.JNE.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.JNE, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.JLT.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.JLT, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.JLE.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.JLE, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.JGT.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.JGT, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.JGE.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.JGE, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.CALL.opcode: {
          let jumpOffset = this.jumpOffset();
          this.put(Disassembler.CALL, new Uint8Array([this.opcode, (this.operand1 >> 8) & 0x0ff, this.operand1 & 0x0ff]), jumpOffset, true);
          break;
        }
				case Disassembler.RETURN.opcode: {
          this.put(Disassembler.RETURN, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.ENTER.opcode: {
          this.operand1 = this.get();
          this.operand2 = this.get();
          this.put(Disassembler.ENTER, new Uint8Array([this.opcode, this.operand1, this.operand2]), this.operand1 + ', ' + this.operand2);
          break;
        }
				case Disassembler.EXIT.opcode: {
          this.put(Disassembler.EXIT, new Uint8Array([this.opcode]));
          break;}
				case Disassembler.READ.opcode: {
          this.put(Disassembler.READ, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.PRINT.opcode: {
          this.put(Disassembler.PRINT, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.BREAD.opcode: {
          this.put(Disassembler.BREAD, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.BPRINT.opcode: {
          this.put(Disassembler.BPRINT, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.TRAP.opcode: {
          this.operand1 = this.get();
          this.put(Disassembler.TRAP, new Uint8Array([this.opcode, this.operand1]), this.operand1.toString());
          break;
        }
				case Disassembler.INVOKEVIRTUAL.opcode: {
          let name = ''; 
          let charCode = this.get4();

          let bytes: number[] = [];
          while (charCode != -1 && this.current < this.uint8Array.length) {
            name += String.fromCharCode(charCode);
            bytes.push((charCode >> 24) & 0x0ff);
            bytes.push((charCode >> 16) & 0x0ff);
            bytes.push((charCode >> 8) & 0x0ff);
            bytes.push(charCode & 0x0ff);
            charCode = this.get4();
          }
          bytes.push((charCode >> 24) & 0x0ff);
          bytes.push((charCode >> 16) & 0x0ff);
          bytes.push((charCode >> 8) & 0x0ff);
          bytes.push(charCode & 0x0ff);

          this.warning = charCode != -1 ? 'This instruction never ends! Terminating value (-1) not found.' : null;
          if (name.length > 30) {
            name = name.slice(0, 30) + "...";
          }
          this.put(Disassembler.INVOKEVIRTUAL, new Uint8Array([this.opcode].concat(bytes)), '"' + name + '"');

          break;
        }
				case Disassembler.DUP_X1.opcode: {
          this.put(Disassembler.DUP_X1, new Uint8Array([this.opcode]));
          break;
        }
				case Disassembler.DUP_X2.opcode: {
          this.put(Disassembler.DUP_X2, new Uint8Array([this.opcode]));
          break;
        }						 
				default: {
          this.warning = 'This is not a valid instruction!';
          this.put({opcode: -1, mnemonic: ''}, new Uint8Array([this.opcode]));
          break;
        }
      }
    }

    this.disassembledInstructions.forEach(disassembledInstruction => {
      if (disassembledInstruction.referencedAddress && disassembledInstruction.referencedAddress >= 0 && disassembledInstruction.referencedAddress < this.uint8Array.length - this.headerSize && !this.startAddresses.includes(disassembledInstruction.referencedAddress)) {
        disassembledInstruction.warning = "This instruction is problematic! It jumps in the middle of another instruction."
      }
    });
  }

  getCodeSize() {
    return this.codeSize;
  }

  getDataSize() {
    return this.dataSize;
  }

  getEntryPoint() {
    return this.entryPoint;
  }

}