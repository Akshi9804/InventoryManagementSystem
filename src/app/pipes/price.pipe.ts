import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true
})
export class PricePipe implements PipeTransform {

  transform(value: number | string, currencySymbol: string = '₹'): string {
    if (value == null || isNaN(Number(value))) return '';

    // Convert the value to a number and format it with commas
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));

    return `${currencySymbol}${formattedPrice}`;
  }

}
