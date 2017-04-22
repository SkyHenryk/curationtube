import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'timeSplitT'})
export class timeSplitTPipe implements PipeTransform {
  transform(value: string): string {
    let resultValue = value.split('T')[0];
    return resultValue;
  }
}

@Pipe({name: 'playtime'})
export class playtimeTPipe implements PipeTransform {
  transform(value: string): string {
      let min = 0
      let sec = 0
    if (value.indexOf('H') > 0 ) {
        min += ( +(value.split("PT")[1].split("H")[0]) ) * 60;
        min += +(value.split("H")[1].split("M")[0])
        sec += +(value.split("M")[1].split("S")[0])

     }
    else if( value.indexOf('M') > 0 ){
        min += +(value.split("PT")[1].split("M")[0])
        sec += +(value.split("M")[1].split("S")[0])
    }
    else{
      sec += +(value.split("PT")[1].split("S")[0])
    }
    let resultValue = ""+ min + ":" + sec
    return resultValue;
  }
}

@Pipe({name: 'likeCountComma'})
export class likeCountCommaPipe implements PipeTransform {
  transform(value: string): string {
      let resultValue = ""
      if (value!=null){
        resultValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return resultValue
  }
}

@Pipe({name: 'cutDescription'})
export class cutDescriptionPipe implements PipeTransform {
  transform(value: string): string {
      let resultValue = ""
      if (value.length > 300){
        resultValue = value.substring(0,300) + "...";
        return resultValue
      }
      else{
          return value
      }

  }
}