import { QueuedFile } from './../models/file.model';
import { FileSizeTypes, SizeUnits } from './../models/constants';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertSizeUnit',
  pure: false
})
export class ConvertSizeUnitPipe implements PipeTransform {

  transform(item: QueuedFile, unit: FileSizeTypes): string {
    let fractionSize = 0;
    switch (unit) {
      case "KB":
        fractionSize = 2;
        break;
      case "MB":
        fractionSize = 3;
        break;
      case "GB":
        fractionSize = 4;
        break;
      default:
        fractionSize = 2
        break;
    }
    let total = (item.file.size / SizeUnits[unit]).toFixed(fractionSize);
    if (total.includes('0.00')) {
      total = 'Approx. ' + total;
    }
    if (item.file.size !== item.loaded) {
      return `${(item.loaded / SizeUnits[unit]).toFixed(fractionSize)} of ${total}`;
    } else {
      return total;
    }
  }

}
