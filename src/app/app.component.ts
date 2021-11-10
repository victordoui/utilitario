import {Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  textoOriginal = '';
  textoTratado = '';

  tratamentoDoProcesso(textoOriginal: string) {

    const quantidadeCaracteres = 1999;
    const pedacos = this.quebrarPedacos(textoOriginal, quantidadeCaracteres);
    this.textoTratado = this.tratarPedacos(pedacos);
  }

  private quebrarPedacos(textoOriginal: string, quantidadeCaracteres: number): string[] {
    let pedacos = [];
    let ind = 0;
    for (let i = 0; i < textoOriginal.length / quantidadeCaracteres; i++) {
      let pedacoTexto = textoOriginal.substring(ind, ind + quantidadeCaracteres);
      pedacos.push(pedacoTexto);
      ind += quantidadeCaracteres;
    }
    return pedacos;
  }

  private tratarPedacos(pedacos: any[]) {

    let montandoTexto = `
DECLARE string_result CLOB;

BEGIN
`;

    for (const umDosPedacos of pedacos) {
      montandoTexto += `
DBMS_LOB.WRITEAPPEND(
  string_result,
  length('${umDosPedacos}'),
  '${umDosPedacos}'
);\n`
    }

    montandoTexto += `
update ur_hbl.CD_BLCO_INFO_CNTEUD_HBL
set TE_BLCO_INFO_CNTEUD = string_result
where ID_BLCO_INFO_CNTEUD = xxx;

commit;`;

    return montandoTexto;
  }

  copyInputMessage(inputElement: HTMLTextAreaElement) {
    inputElement.select();
    document.execCommand('copy');

  }
}
