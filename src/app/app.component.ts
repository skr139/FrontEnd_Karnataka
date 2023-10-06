import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { Chart, ChartConfiguration } from 'chart.js';
import { FormControl } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontEnd';
  fechaInicio: String = "2023-02-08";
  fechaFin: String = "2023-02-9";
  nombre: String = "";
  almacen: string = "";
  cantidad = 0;
  empresasNombre: String[] = [];
  empresas: any[] = [];
  ventas: number[] = [];
  resp: any[] = [];
  public empresasSelec: String[]=[];
  ventasSelec: number[] = [];
  actualizarGraf:boolean=false;

  // Para la gráfica *********************************************
  public leyendaChart = true;
  public pluginsChart = [];
  public datosChart: ChartConfiguration<'bar'>['data'] = {
    labels: this.empresasSelec,
    datasets: [
      { data: this.ventasSelec, label: 'Ventas' },
    ]
  };
  public opcionesChart: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    maintainAspectRatio:false
  };
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  //******************* Fin grafica *******************/
  constructor(private http: HttpClient) { }

  obtenerDatos() {
    const url: string = "http://localhost:8080/ventas/filtrarPorFecha?fechaInicio=" + this.fechaInicio + "&fechaFin=" + this.fechaFin;
    console.log(url);
    this.http.get<any[]>(url).subscribe((respuesta: any) => {
      console.log(respuesta[2].nombre);
      //this.empresas = respuesta;
      this.resp = respuesta;

      this.resp.forEach(objeto => {
        var contador = 0;
        if (!this.empresasNombre.includes(objeto.nombre)) { // Si aun no existe
          this.empresas.push(objeto);  // Añadir objeto completo
          this.empresasNombre.push(objeto.nombre); // Añadir nombre del objeto
          this.resp.forEach(objRep => {
            if (objeto.nombre == objRep.nombre)
              contador = contador + objRep.cantidad;
          });
          this.ventas.push(contador);
        }
      });
    });
    console.log(this.empresasNombre);
    console.log(this.ventas);
  }

  //************************  Elementos seleccionados  *****************************/
  checkSeleccionado(event: any) {
    this.ventasSelec=[]; // Inicializar las ventas seleccionadas
    this.empresasSelec= event;
    var n:String="";
    for(var i=0;i<this.empresasSelec.length;i++){
      n = this.empresasSelec[i];
      //console.log(this.empresasNombre.findIndex(prod=>prod==n));
      this.ventasSelec.push(this.ventas[this.empresasNombre.findIndex(prod=>prod==n)]); 
    }
    console.log(this.ventasSelec);
    this.actualizarGraf=true;
    this.datosChart.labels = this.empresasSelec;
    this.datosChart.datasets[0].data = this.ventasSelec;
    this.chart?.update();
  }

}
