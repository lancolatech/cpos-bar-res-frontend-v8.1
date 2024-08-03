import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: any, currencyCode: string = 'KES', symbolDisplay: 'code' | 'symbol' | 'symbol-narrow' | boolean = 'symbol-narrow'): string {
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      return parsedValue.toLocaleString('en-US', {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: symbolDisplay as string  // Explicit cast to string
      });
    } else {
      return '0.00';
    }
  }
}
