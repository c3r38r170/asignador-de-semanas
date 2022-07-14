function mod(n, m) {
  return ((n % m) + m) % m;
}

let personas = [];
let colores = [];
let muchos_colores = [
'#EA7D97', 
'#707985', 
'#DCCFCE', 
'#8AA8A9', 
'#BB917C', 
'#7D8280', 
'#98885B', 
'#48A579', 
'#63B29F', 
'#C9C6B9', 
'#EE5644', 
'#D3586B', 
'#D5DCA8', 
'#5CC2C1', 
'#5C7A78', 
'#4E7196', 
'#CE6630', 
'#5E7E61', 
'#ABB16D', 
'#B7D594',
]

function random_colors(){
	let pers = document.getElementById('personas').value.replace(/\s/g,'').split(',');
	let str = "";
	for (var i = 0; i < pers.length; i++) {
		str += muchos_colores[Math.floor(Math.random()*muchos_colores.length)] + ',';
	}
	document.getElementById('colores').value = str;
}

/*Dada una fecha, retorna el numero de semana del año que le corresponde*/
function semana(fecha) {
	ahora = new Date();
	fecha_inicial = new Date(ahora.getFullYear(), 0, 1);
	var dias = Math.floor((fecha - fecha_inicial) / (24 * 60 * 60 * 1000));
	var semana = Math.ceil(dias / 7);
	return semana;
}

/*Dada una fecha, devuelve la letra correspondiente al día de la semana de Domingo(0) a Sábado(6)*/
function letra_dia(fecha){
	var array = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
	return array[fecha.getDay()];
}

/*Dada una fecha, devuelve el mes en string desde Enero (0) a Diciembre (11)*/
function mes(fecha){
	var array = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
	return array[fecha.getUTCMonth()];
}

function recalcular(){
	/* for(var i = 1; i <= 12; i++){
		document.getElementById('mes-' + i).innerHTML = "";
	} */
	personas = [];
	colores = [];
	personas = document.getElementById('personas').value.replace(/\s/g,'').split(',');
	colores = document.getElementById('colores').value.replace(/\s/g,'').split(',').map(color=>[color,tinycolor(color).darken()]);
	var yr = document.getElementById('yr').value;
	console.log(personas);
	console.log(colores);
	
	var base = new Date(yr, 1, 1);
	var ultimo_dia = new Date(base.getFullYear(), 11, 31);
	var calendario = [];
	/*Itero a través del 01/01 del corriente año hasta el 31/12 del corriente año*/
	for (var d = new Date(base.getFullYear(), 0, 1); d <= ultimo_dia; d.setDate(d.getDate() + 1)) {
		/*Saco los sabados y domingos (lo dejé con letras para que sea mas legible, pero le quita performance)*/
		if(letra_dia(d) != 'S' && letra_dia(d) != 'D'){
			console.log(mod(semana(d),personas.length));
			calendario.push({
			'mes_int' :  d.getUTCMonth() + 1,		//Este sirve para el indice de la tabla en el HTML
			'mes' :  mes(d),		//Mes en letras	
			'fecha' :  d.getUTCDate(),// + " [" + letra_dia(d) + "]",		//Fecha en número + Letra del día de la semana
			letra:letra_dia(d),	//
			numeroDiaSemana:d.getDay(),
			'integrante' : personas[mod(semana(d),personas.length)],
			'color' : colores[mod(semana(d),personas.length)]
		});
		}else{
			calendario.push({
			'mes_int' :  d.getUTCMonth() + 1,		//Este sirve para el indice de la tabla en el HTML
			'mes' :  mes(d),		//Mes en letras	
			'fecha' :  d.getUTCDate(),// + " [" + letra_dia(d) + "]",		//Fecha en número + Letra del día de la semana
			letra:letra_dia(d),	//
			'integrante' : ''
			// ,
			// 'color' : '#444'
		});

		}
	}
	console.log(calendario);
	/*Se podrían usar web-components, pero esta es la forma mas "didáctica" que encontré*/
	for(var dia of calendario){
		let celda={
			classList:['mes-dato']
		};
		
		if((dia.numeroDiaSemana==2 && dia.fecha!=1) || (dia.fecha==2 && ![1,5].includes(dia.numeroDiaSemana) &&dia.integrante) )
			celda.innerText=dia.integrante;
		if(dia.color){
			let colorClaro=dia.color[0],bordeClaro='solid 2px '+colorClaro
			let colorFuerte=dia.color[1],bordeFuerte='solid 2px '+colorFuerte;
			celda.style={
				backgroundColor:colorClaro,
				borderRight:bordeFuerte,
				borderLeft:bordeFuerte,
				borderBottom:(dia.numeroDiaSemana==5 || [
					'1,31'
					,'2,28'
					,'3,31'
					,'4,30'
					,'5,31'
					,'6,30'
					,'7,31'
					,'8,31'
					,'9,30'
					,'10,31'
					,'11,30'
					,'12,31'
				].includes(`${dia.mes_int},${dia.fecha}`))?
					bordeFuerte
					:bordeClaro
			}
			if(dia.numeroDiaSemana==1 || dia.letra=='L')
				celda.style.borderTop=bordeFuerte;
		}
		if(dia.integrante)
			celda.classList.push('mes-contenido');

		addElement(
			gEt('mes-'+dia.mes_int)
			,['DIV',{
				innerText:dia.fecha
				,classList:['mes-dato','mes-fecha']
			}]
			,['DIV',{
				innerText:dia.letra
				,classList:['mes-dato','mes-dia','mes-dia-'+dia.letra]
			}]
			,['DIV',celda]
		);
	}
}

