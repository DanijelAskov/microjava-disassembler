import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule, TooltipOptions } from 'ng2-tooltip-directive';

import { AppComponent } from './app.component';
import { BytecodeReaderComponent } from './bytecode-reader/bytecode-reader.component';
import { BytecodeViewerComponent } from './bytecode-viewer/bytecode-viewer.component';
import { StatsComponent } from './stats/stats.component';

const MyDefaultTooltipOptions: TooltipOptions = {
  'show-delay': 100,
  'placement': 'right',
  'theme': 'light'
}

@NgModule({
  declarations: [
    AppComponent,
    BytecodeReaderComponent,
    BytecodeViewerComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    TooltipModule.forRoot(MyDefaultTooltipOptions as TooltipOptions)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
