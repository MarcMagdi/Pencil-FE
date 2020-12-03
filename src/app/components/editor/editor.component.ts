import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import MediumEditor from 'medium-editor';
import { debounce } from 'debounce';
import katex from 'katex';
import { EditorService } from '../../shared/services/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit {
  data: string;
  editor: any;
  loading: boolean;

  constructor(public editorService: EditorService) {
    this.loading = true;
    this.getInitialData().then(() => (this.loading = false));
  }

  @ViewChild('textArea') textArea: ElementRef;

  ngOnInit(): void {}
  ngAfterViewInit() {
    const edit = this.textArea.nativeElement;
    this.editor = new MediumEditor(edit, {
      placeholder: true,
    });

    this.editor.subscribe(
      'editableInput',
      debounce(() => {
        return this.pushLatestUpdates();
      }, 200)
    );

    this.editor.subscribe('editableInput', (event) => {
      if (event.data === '$') {
        this.updateLatexNode();
      }
    });
  }

  pushLatestUpdates() {
    const snapshot = this.editor.getContent();
    return this.editorService.pushTextChanges(snapshot);
  }

  async getInitialData() {
    this.data = await this.editorService.getInitialValue();
    this.editor.setContent(this.data);
  }

  updateLatexNode() {
    const editor = document.getElementById('editor');
    const currentElement = this.editor.getSelectedParentElement();
    const updatedValue = this.convertLatex(currentElement);

    if (updatedValue) {
      currentElement.parentNode.insertBefore(updatedValue, currentElement);
      this.editor.addElements(editor.lastElementChild);

      editor.removeChild(currentElement);
    }
  }

  convertLatex(currentElement) {
    const currentElementData = currentElement.innerHTML;
    const latexValue = currentElementData.match(/\$.*?\$/g);
    if (latexValue) {
      const val = latexValue[0];
      const valSub = val.substr(1, val.length - 2);
      const convertedLatex = katex.renderToString(valSub, {
        throwOnError: true,
      });

      const updatedElement = currentElementData.replace(val, convertedLatex);
      const node = document.createElement('p');
      node.innerHTML = updatedElement;

      return node;
    }

    return false;
  }
}
