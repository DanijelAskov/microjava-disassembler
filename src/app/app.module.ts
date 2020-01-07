import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { BytecodeReaderComponent } from './bytecode-reader/bytecode-reader.component';
import { BytecodeViewerComponent } from './bytecode-viewer/bytecode-viewer.component';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    BytecodeReaderComponent,
    BytecodeViewerComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
